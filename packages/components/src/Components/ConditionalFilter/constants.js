/* eslint-disable react/display-name */
import React, { Fragment } from 'react';
import Text from './Text';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Group from './Group';

export const conditionalFilterType = {
    text: 'text',
    checkbox: 'checkbox',
    radio: 'radio',
    custom: 'custom',
    group: 'group'
};

export const typeMapper = (type) => {
    return {
        text: (props) => <Text {...props} />,
        checkbox: (props) => <Checkbox {...props} />,
        radio: (props) => <Radio {...props} />,
        custom: (props) => <Fragment {...props}/>,
        group: (props) => <Group {...props} />
    }[type] || Text;
};

export const groupType = {
    checkbox: 'checkbox',
    radio: 'radio',
    plain: 'plain'
};

