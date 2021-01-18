import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { FormGroup, Alert } from '@patternfly/react-core';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import Select from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';

const EnhancedSelect = ({ mutator, options, label, ...props }) => {
    const formOptions = useFormApi();
    const intl = useIntl();

    const selectedSourceType = formOptions.getState().values.source_type;

    return (<FormGroup label={label} fieldId={props.name || props.id}>
        {selectedSourceType === 'amazon' && <Alert
            className="pf-u-mt-sm pf-u-mb-md"
            variant="info"
            isInline
            title={intl.formatMessage({ id: 'aws.autoRegistrationAlert', defaultMessage: 'Select Subscription Watch for auto-registration' })}
        />}
        <Select hideLabel {...props} options={options.map((option) => mutator(option, formOptions))}/>
    </FormGroup>);
};

EnhancedSelect.propTypes = {
    mutator: PropTypes.func,
    options: PropTypes.array
};

export default EnhancedSelect;
