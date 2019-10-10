import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import { ConditionalFilter, conditionalFilterType, groupType  } from '../../components/src/Components/ConditionalFilter/index.js'

const DemoApp = () => {
    const [ value, onChange ] = useState();
    return (
        <ConditionalFilter items={[{
            type: conditionalFilterType.group,
            label: 'typeahead',
            value: 'typeahead',
            filterValues: {
                onChange: (event, value) => onChange(value),
                isFilterable: true,
                value,
                items: [{
                    value: 'first',
                    label: 'Fisrt'
                }, {
                    value: 'second',
                    label: 'Second'
                }]
            }
        }]}
        />
    );
}

ReactDOM.render(<DemoApp />, document.querySelector('.demo-app'));
