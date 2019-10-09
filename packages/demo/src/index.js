import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import { ConditionalFilter, conditionalFilterType, groupType  } from '../../components/src/Components/ConditionalFilter/index.js'

const DemoApp = () => {
    const [ value, onChange ] = useState();
    return (
        <ConditionalFilter items={[{
            type: conditionalFilterType.typeahead,
            label: 'typeahead',
            value: 'typeahead',
            filterValues: {
                onChange: (event, value) => onChange(value),
                value,
                items: [{
                    "Satellite": ["environment=production", "environment=test", "geo=MA"],
                    "InsightsClient": ["group=saturn", "group=hallsat", "tag6"],
                    "Foobar": ["tag7", "tag8", "tag9"]
                }]
            }
        }]}
        />
    );
}

ReactDOM.render(<DemoApp />, document.querySelector('.demo-app'));
