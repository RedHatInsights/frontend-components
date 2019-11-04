import React from 'react';
import PropTypes from 'prop-types';
import { Radio, FormHelperText } from '@patternfly/react-core';

const AuthRadio = ({ label, input, authName, supportedAuthTypes, disableAuthType }) => {
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
    input: PropTypes.shape({
        value: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    authName: PropTypes.string.isRequired,
    disableAuthType: PropTypes.bool,
    supportedAuthTypes: PropTypes.arrayOf(PropTypes.string)
};

AuthRadio.defaultProps = {
    disableAuthType: false
};

const AuthSelectProvider = ({ FieldProvider, ...rest }) =>
    (
        <FieldProvider { ...rest }>
            { (props) =>  <AuthRadio  { ...props } name={ props.input.name }/> }
        </FieldProvider>
    );

export default AuthSelectProvider;
