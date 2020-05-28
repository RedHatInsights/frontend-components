import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

const Authentication = (rest) => {
    const formOptions = useFormApi();

    const { authentication } = formOptions.getState().values;

    const doNotRequirePassword = rest.validate && rest.validate.filter(({ type }) => type !== validatorTypes.REQUIRED);

    const componentProps = {
        ...rest,
        ...(authentication && authentication.id ? {
            isRequired: false,
            helperText: `Changing this resets your current ${rest.label}.`,
            validate: doNotRequirePassword
        } : {})
    };

    const Component = componentMapper[componentTypes.TEXT_FIELD];

    return (
        <Component { ...componentProps } />
    );
};

export default Authentication;
