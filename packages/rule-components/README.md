## Usage

If you want to use rules table component please pass entire dataset from server to it and with columns you'll have the chance to properly show the rows.

```JSX
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RuleTable, { severity } from '@redhat-cloud-services/rule-components/dist/cjs/RuleTable';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import '@redhat-cloud-services/frontend-components/components/Battery.css';
import {
    descriptionFilter,
    totalRiskFilter,
    ansibleSupportFilter,
    categoryFilter,
    incidentRulesFilter,
    likelihoodFilter,
    riskOfChangeFilter,
    ruleStatusFilter,
    impactFilter
} from '@redhat-cloud-services/rule-components/dist/cjs/RuleFilters';
import data from './data.json';

class MyCmp extends Component {
    render() {
        return <RuleTable
            filters={{
                descriptionFilter,
                totalRiskFilter,
                ansibleSupportFilter,
                categoryFilter,
                incidentRulesFilter,
                likelihoodFilter,
                riskOfChangeFilter,
                ruleStatusFilter,
                impactFilter
            }}
            fetchData={console.log}
            rules={data}
            columns={[
                { title: 'Description', selector: 'description' },
                { title: 'Added', selector: ({ created_at: created }) => <DateFormat date={new Date(created)} /> },
                {
                    title: 'Total risk',
                    selector: ({ total_risk: riskNumber }) => (
                        <Battery label={Object.values(severity)[riskNumber - 1]} severity={riskNumber} />
                    )
                }
            ]}
            filterValues={{
                totalRiskFilter: [ 'low' ]
            }}
            detail={() => <div>This is detail that is shown when user colapses/expands</div>}
        />;
    }
}

ReactDOM.render(<MyCmp />, document.querySelector('.demo-app'));
```


*NOTE: you can also use package import `import { RuleTable, severity } from '@redhat-cloud-services`, just be careful as your bundle size might increase a lot, because treeshaking might not work properly. If that happens please consider using direc imports as in example.*

### Props

* `filters` - list or object of filters
* `rules` - actual data from API, including meta information
* `columns` - list of columns to be shown. Each column should have `selector` attribute
* `detail` - what to render something in expendable row
* `isLoading` - to indicate that data are being fetched from server
* `fetchData` - function to fetch the actual data from server
* `toolbarProps` - additional props for toolbar
* `filterValues` - applied filters in table, they should match signature of `filters`
* `sortBy` - PF4 sortBy object
* `loadingBars` - number of loading bars when data are feched

#### `filters`

There are some predefined filters to be used in rules table, please check the detail above. It can be either array, or object with specific names. If you want to pass some custom filters please pass it as function with one argument that has shape of `{ onChange, value, ...props }` to properly manage the state of filter.

```
descriptionFilter,
totalRiskFilter,
ansibleSupportFilter,
categoryFilter,
incidentRulesFilter,
likelihoodFilter,
riskOfChangeFilter,
ruleStatusFilter,
impactFilter
```

#### `rules`

This is the main data that comes from API. It expects 2 properties `data` and `meta`.

##### `rules.data`

Array of rows to be shown, you will select what should be visible in each cell via `colum[IDX].selector`

##### `rules.meta`

Meta information about pagination where `count` is the most crutial part, offset and limit will be precalculated and you should update it only when chaning page.

```
{
    count,
    offset,
    limit
}
```

#### `columns`

Array of columns to be shown. Each column needs to have `title` - to show anything in table header and `selector` to show data in each cell of table, it can either be array or string to as lodash accessor or function to render something specific. If you choose function for `selector` you'll receive row data, row key and cell key in arguments. If you want to disable sort by for specific cells you have to pass `disableSort`.

#### `detail`

Function or React node to show something specific in detail of collapsible row.

#### `isLoading`

If your data are loading pass `isLoading` property to indicate data loading. Columns will still be visible, but not sortable.

#### `fetchData`

This function is called everytime somthing changes (after each user interaction). You will receive one object with `meta` for pagination, `filterValues` for filtering and `sortBy` for sorting.

#### `filterValues`

Applied filters outside of RuleTable component. It should be object with keys to match keys of `filters`. Values should be either array of strings/numbers or just string/number they will be then matched to values of each filter. If the key is not present in `filters` the filter will not be visible, if the value is not present in available filters raw value will be shown.

#### `sortBy`

This is to indicate which cell is sorted by. It is [sortBy from PF4](https://patternfly-react.surge.sh/documentation/react/components/table#props).
