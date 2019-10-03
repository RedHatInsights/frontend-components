import { Fragment } from 'react';
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
        text: Text,
        checkbox: Checkbox,
        radio: Radio,
        custom: Fragment,
        group: Group
    }[type] || Text;
};

export const groupType = {
    checkbox: 'checkbox',
    radio: 'radio',
    plain: 'plain'
};
