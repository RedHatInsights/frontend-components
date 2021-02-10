import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Spinner, FormHelperText } from '@patternfly/react-core';
import FormSpy from '@data-driven-forms/react-form-renderer/dist/esm/form-spy';

export const ValidatingSpinner = ({ validating }) => {
    const intl = useIntl();

    return (<FormHelperText isHidden={!validating}>
        <Spinner size="md" className="pf-u-mr-md" />{ intl.formatMessage({ id: 'wizard.validating', defaultMessage: 'Validating' })}
    </FormHelperText>);
};

ValidatingSpinner.propTypes = {
    validating: PropTypes.bool.isRequired
};

const validated = (_, { meta }) => {
    if (meta.validating) {
        return {
            // FormSpy is a fallback solution
            // FF sometimes does not set validating to 'false' on the field
            // So we need to also check the FormSpy.validating
            helperText: <FormSpy>
                {({ validating }) => <ValidatingSpinner validating={validating} />}
            </FormSpy>
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
