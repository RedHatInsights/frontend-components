## Usage

If you want to use rules table component please pass entire dataset from server to it and with columns you'll have the chance to properly show the rows.

```JSX
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import RuleTable, { severityLabels } from '../../rule-components/src/RuleTable';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import '@redhat-cloud-services/frontend-components/components/Battery.css';
import data from './data.json';

class MyCmp extends Component {
    render() {
        return <RuleTable rules={data} columns={[
            { title: 'Description', selector: 'description' },
            { title: 'Added', selector: ({ created_at: created }) => <DateFormat date={new Date(created)} /> },
            {
                title: 'Total risk',
                selector: ({ total_risk: riskNumber }) => <Battery label={severityLabels[riskNumber - 1]} severity={riskNumber} />
            }
        ]}/>;
    }
}

ReactDOM.render(<MyCmp />, document.querySelector('.demo-app'));
```
