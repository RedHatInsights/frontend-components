import React from 'react';
import { TextField, TextareaField, SwitchField, RadioField, SelectField, CheckboxField } from '../FormFields/formFields';

const typeMapper = (type = 'string') => ({
    string: { component: TextField, type: 'text' },
    integer: { component: TextField, type: 'number' },
    number: { component: TextField, type: 'number' },
    updown: { component: TextField, type: 'number' },
    boolean: { component: SwitchField },
    textarea: { component: TextareaField },
    password: { component: TextField, type: 'password' },
    hidden: { component: ({ isRequired, ...props }) => // eslint-disable-line react/display-name
        <input { ...props } required={ isRequired } />, type: 'hidden' },
    radio: { component: RadioField, type: 'radio' },
    select: { component: SelectField, type: 'select' },
    color: { component: TextField, type: 'color' },
    checkboxes: { component: CheckboxField, type: 'checkbox' }
})[type];

export default (type, widget) => typeMapper(widget || type);
