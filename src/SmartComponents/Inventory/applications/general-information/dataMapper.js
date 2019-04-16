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

const statusHelper = {
    DOWN: <OutlinedArrowAltCircleUpIcon className="ins-c-inventory__detail--up" />,
    UP: <OutlinedArrowAltCircleDownIcon className="ins-c-inventory__detail--down" />
};

const enabledHelper = {
    true: <CheckCircleIcon className="ins-c-inventory__detail--enabled" />,
    false: <TimesIcon className="ins-c-inventory__detail--disabled" />
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
        mount_point,
        options,
        type
    }) => ({
        isOpen: false,
        child: <div>
            { options && Object.keys(options).map(oneKey => `${oneKey}=${options[oneKey]}`).join(',  ') }
        </div>,
        cells: [
            device,
            label,
            mount_point,
            type
        ]
    })),
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
                <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
        },
        item.type
    ]))
});

export const repositoriesMapper = ({ enabled, disabled } = {}) => ({
    cells: [
        {
            title: 'Name',
            transforms: [ sortable ]
        },
        'Enabled',
        'GPG check'
    ],
    rows: [ ...enabled, ...disabled ].map(repository => ([
        {
            title: <a href={ repository.base_url } target="_blank" rel="noopener noreferrer">{ repository.name }</a>,
            sortValue: repository.name
        },
        { title: enabledHelper[repository.enabled] },
        { title: enabledHelper[repository.gpgcheck] }
    ]))
});

export const generalMapper = (data = [], title = '') => ({
    cells: [{
        title,
        transforms: [ sortable ]
    }],
    rows: data.map(item => ([ item ]))
});
