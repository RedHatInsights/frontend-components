import { TextField, TextareaField, SwitchField } from '../FormFields/formFields';

const typeMapper = (type = 'string') => ({
    string: { component: TextField, type: 'text' },
    integer: { component: TextField, type: 'number' },
    updown: { component: TextField, type: 'number' },
    boolean: { component: SwitchField },
    textarea: { component: TextareaField },
    password: { component: TextField, type: 'password' }
})[type];

export default (type, widget) => typeMapper(widget || type);
