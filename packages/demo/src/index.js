import React, { Component, useState, Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import { ConditionalFilter, conditionalFilterType, groupType  } from '../../components/src/Components/ConditionalFilter/index.js'

const DemoApp = () => {
    const [ value, onChange] = useState();
    const [selected, setSelected] = useState([]);

    const selectedFiltered = Object.values(selected)[0];

    return (
        <ConditionalFilter items={[{
            type: conditionalFilterType.group,
            label: 'typeahead',
            placeholder: 'test',
            filterValues: {
                selected: value,
                onChange: (event, value) => {
                    onChange(value);
                    setSelected({ selected: value });
                },
                isFilterable: true,
                groups: [
                    {
                        label: 'Satellite',
                        value: 'Satellite',
                        items: [
                            {
                                label: 'environment=production',
                                value: 'environment=production'
                            },
                            {
                                label: 'geo=MA',
                                value: 'geo=MA'
                            }
                        ]
                    },
                    {
                        label: 'Insights Client',
                        value: 'insights client',
                        items: [
                            {
                                label: 'environment=ci',
                                value: 'environment=ci'
                            },
                            {
                                label: 'geo=NC',
                                value: 'geo=NC'
                            }
                        ]
                    }
                ]
            }
        }]}
        />
    );
}

ReactDOM.render(<DemoApp />, document.querySelector('.demo-app'));
