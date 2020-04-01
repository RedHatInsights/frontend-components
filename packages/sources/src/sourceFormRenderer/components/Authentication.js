import React from 'react';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';

const Authentication = ({ FieldProvider, formOptions, ...rest }) => {
    const { authentication } = formOptions.getState().values;

    const doNotRequirePassword = (...args) => !args[0] ? '' : rest.validate(...args);

    const componentProps = {
        ...rest,
        component: formFieldsMapper[componentTypes.TEXT_FIELD],
        ...(authentication && authentication.id ? {
            isRequired: false,
            helperText: `Changing this resets your current ${rest.label}.`,
            validate: doNotRequirePassword
        } : {})
    };

    return (
        <FieldProvider { ...componentProps } />
    );
};

export default Authentication;
