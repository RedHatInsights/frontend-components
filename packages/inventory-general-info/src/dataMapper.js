/* eslint-disable camelcase */

import React from 'react';
import {
    CheckCircleIcon,
    TimesIcon,
    OutlinedQuestionCircleIcon,
    OutlinedArrowAltCircleUpIcon,
    OutlinedArrowAltCircleDownIcon
} from '@patternfly/react-icons';
import { sortable } from '@patternfly/react-table';
import { Tooltip } from '@patternfly/react-core';

export const statusHelper = {
    UP: <Tooltip content={<div>
        Service is running
    </div>}>
        <span><OutlinedArrowAltCircleUpIcon className="ins-c-inventory__detail--up" /></span>
    </Tooltip>,
    DOWN: <Tooltip content={<div>
        Service is stopped
    </div>}>
        <span><OutlinedArrowAltCircleDownIcon className="ins-c-inventory__detail--down" /></span>
    </Tooltip>
};

export const enabledHelper = {
    true: <Tooltip content={<div>
        Source enabled
    </div>}>
        <span><CheckCircleIcon className="ins-c-inventory__detail--enabled" /></span>
    </Tooltip>,
    false: <Tooltip content={<div>
        Source disabled
    </div>}>
        <span><TimesIcon className="ins-c-inventory__detail--disabled" /></span>
    </Tooltip>
};

export const diskMapper = (devices = []) => ({
    cells: [
        {
            title: 'Device',
            transforms: [ sortable ]
        },
        {
            title: 'Label',
            transforms: [ sortable ]
        },
        {
            title: 'Mount point',
            transforms: [ sortable ]
        },
        {
            title: 'Type',
            transforms: [ sortable ]
        }
    ],
    rows: devices.map(({
        device,
        label,
        mountpoint,
        options,
        mounttype
    }) => {
        const calculatedOptions = (options && options.options) || options;
        return ({
            isOpen: false,
            child: <div>
                {
                    calculatedOptions &&
                    Object.entries(calculatedOptions.value || calculatedOptions)
                    .map(([ oneKey, option ]) => `${oneKey}=${option.value || option}`).join(',  ')
                }
            </div>,
            cells: [
                (device && device.value) || device,
                label,
                (mountpoint && mountpoint.value) || mountpoint,
                (mounttype && mounttype.value) || mounttype
            ]
        });
    }),
    expandable: true
});

export const productsMapper = (products = []) => ({
    cells: [
        {
            title: 'Name',
            transforms: [ sortable ]
        },
        'Status'
    ],
    rows: products.map(product => ([
        product.name,
        {
            title: statusHelper[product.status] ||
                <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
        }
    ]))
});

export const interfaceMapper = (data = []) => ({
    cells: [
        {
            title: 'MAC address',
            transforms: [ sortable ]
        },
        {
            title: 'MTU',
            transforms: [ sortable ]
        },
        {
            title: 'Name',
            transforms: [ sortable ]
        },
        'State',
        {
            title: 'Type',
            transforms: [ sortable ]
        }
    ],
    rows: data.map(item => ([
        item.mac_address,
        item.mtu,
        item.name,
        {
            title: statusHelper[item.state] ||
            <Tooltip content={<div>
                Unknown service status
            </div>}>
                <span><OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" /></span>
            </Tooltip>
        },
        item.type
    ]))
});

export const repositoriesMapper = ({ enabled, disabled } = { enabled: [], disabled: [] }) => ({
    cells: [
        {
            title: 'Name',
            transforms: [ sortable ]
        },
        {
            title: 'Enabled',
            transforms: [ sortable ]
        },
        {
            title: 'GPG check',
            transforms: [ sortable ]
        }
    ],
    rows: [ ...enabled, ...disabled ].map(repository => ([
        {
            title: repository.name,
            sortValue: repository.name
        },
        {
            title: enabledHelper[Boolean(repository.enabled)],
            sortValue: `${repository.enabled}`
        },
        {
            title: enabledHelper[Boolean(repository.gpgcheck)],
            sortValue: `${repository.gpgcheck}`
        }
    ])),
    filters: [
        { type: 'textual' },
        {
            type: 'checkbox',
            options: [
                { label: 'Is enabled', value: 'true' },
                { label: 'Not enabled', value: 'false' }
            ]
        },
        {
            type: 'checkbox',
            options: [
                { label: 'Is enabled', value: 'true' },
                { label: 'Not enabled', value: 'false' }
            ]
        }
    ]
});

export const generalMapper = (data = [], title = '') => ({
    cells: [{
        title,
        transforms: [ sortable ]
    }],
    rows: data.map(item => ([ item ])),
    filters: [{ type: 'textual' }]
});
