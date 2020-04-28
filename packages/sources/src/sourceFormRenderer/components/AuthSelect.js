import React from 'react';
import PropTypes from 'prop-types';
import { Radio, FormHelperText } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';

const AuthRadio = (props) => {
    const { label, input, authName, supportedAuthTypes, disableAuthType } = useFieldApi(props);

    let isDisabled = disableAuthType;
    const isSelected = input.value === authName;

    if (input.value && supportedAuthTypes && !supportedAuthTypes.includes(input.value)) {
        input.onChange(undefined);
    }

    return (
        <React.Fragment>
            <Radio
                value={authName}
                isChecked={isSelected}
                name={input.name}
                onChange={() => input.onChange(authName)}
                label={label}
                id={`${input.name}-${authName}`}
                isDisabled={isDisabled}
            />
            {disableAuthType && !isSelected && <FormHelperText isHidden={false} className="pf-m-disabled">
                You cannot change the authtype, when editing.
            </FormHelperText>}
        </React.Fragment>
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
