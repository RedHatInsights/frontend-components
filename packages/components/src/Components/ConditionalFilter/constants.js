import { Fragment } from 'react';
import Text from './Text';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Group from './Group';
import Typeahead from './Typeahead';

export const conditionalFilterType = {
    text: 'text',
    checkbox: 'checkbox',
    radio: 'radio',
    custom: 'custom',
    typeahead: 'typeahead',
    group: 'group'
};

export const typeMapper = (type) => {
    return {
        text: Text,
        typeahead: Typeahead,
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
