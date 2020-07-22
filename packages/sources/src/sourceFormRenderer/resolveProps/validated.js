import React from 'react';
import { useIntl } from 'react-intl';
import { Spinner, FormHelperText } from '@patternfly/react-core';

export const ValidatingSpinner = () => {
    const intl = useIntl();

    return (<FormHelperText isHidden={false}>
        <Spinner size="md" className="pf-u-mr-md" />{ intl.formatMessage({ id: 'wizard.validating', defaultMessage: 'Validating' })}
    </FormHelperText>);
};

const validated = (_, { meta }) => {
    if (meta.validating) {
        return {
            helperText: <ValidatingSpinner />
        };
    }

    if (meta.valid) {
        return {
            validated: 'success',
            FormGroupProps: {
                validated: 'success'
            }
        };
    }

    return {};
};

export default validated;
