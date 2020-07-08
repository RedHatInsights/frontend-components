import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import { FormattedMessage } from 'react-intl';
import { FormHelperText } from '@patternfly/react-core';

const Authentication = (rest) => {
    const formOptions = useFormApi();

    const { authentication } = formOptions.getState().values;

    const doNotRequirePassword = rest.validate && rest.validate.filter(({ type }) => type !== validatorTypes.REQUIRED);

    const componentProps = {
        ...rest,
        ...(authentication && authentication.id ? {
            isRequired: false,
            helperText: <FormHelperText isHidden={false}>
                <FormattedMessage
                    id="wizard.ChangingThisResetsYourCurrentRestLabel"
                    defaultMessage="Changing this resets your current {label}."
                    values={{ label: rest.label }}
                />
            </FormHelperText>,
            validate: doNotRequirePassword
        } : {})
    };

    const Component = componentMapper[componentTypes.TEXT_FIELD];

    return (
        <Component { ...componentProps } />
    );
};

export default Authentication;
