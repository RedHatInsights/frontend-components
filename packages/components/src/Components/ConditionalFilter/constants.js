import Text from './Text';
import Checkbox from './Checkbox';
import Radio from './Radio';

export const conditionalFilterType = {
    text: 'text',
    checkbox: 'checkbox',
    radio: 'radio'
};

export const typeMapper = (type) => {
    return {
        text: Text,
        checkbox: Checkbox,
        radio: Radio
    }[type] || Text;
}
