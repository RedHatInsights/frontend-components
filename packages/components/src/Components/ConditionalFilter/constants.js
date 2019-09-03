import { Fragment } from 'react';
import Text from './Text';
import Checkbox from './Checkbox';
import Radio from './Radio';

export const conditionalFilterType = {
    text: 'text',
    checkbox: 'checkbox',
    radio: 'radio',
    custom: 'custom'
};

export const typeMapper = (type) => {
    return {
        text: Text,
        checkbox: Checkbox,
        radio: Radio,
        custom: Fragment
    }[type] || Text;
}
