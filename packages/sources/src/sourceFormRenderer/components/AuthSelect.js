import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';

const AuthRadio = (props) => {
    const { label, input, authName, supportedAuthTypes, disableAuthType } = useFieldApi(props);

    const isSelected = input.value === authName;

    if (input.value && supportedAuthTypes && !supportedAuthTypes.includes(input.value)) {
        input.onChange(undefined);
    }

    return (
        <Radio
            value={authName}
            isChecked={isSelected}
            name={input.name}
            onChange={() => input.onChange(authName)}
            label={label}
            id={`${input.name}-${authName}`}
            isDisabled={disableAuthType}
        />
    );
};

AuthRadio.propTypes = {
    label: PropTypes.string,
    authName: PropTypes.string.isRequired,
    disableAuthType: PropTypes.bool,
    supportedAuthTypes: PropTypes.arrayOf(PropTypes.string)
};

AuthRadio.defaultProps = {
    disableAuthType: false
};

export default AuthRadio;
