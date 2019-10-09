import React from 'react';
import PropTypes from 'prop-types';
import { Radio, FormHelperText } from '@patternfly/react-core';

const AuthRadio = ({ label, name, input, authName, index, formOptions, applicationTypes, sourceTypes }) => {
    let application = {};
    let isDisabled = false;
    const values = formOptions.getState().values;
    const isSelected = input.value === authName;
    const supportedAuthTypes = sourceTypes.find(type => type.name === values.source_type).schema.authentication.map((auth) => auth.type);

    if (values.application) {
        application = applicationTypes.find(({ id }) => id === values.application.application_type_id);
        isDisabled = !application.supported_authentication_types[values.source_type].includes(authName);
    }

    if (isDisabled && isSelected) {
        input.onChange(undefined);
    }

    if (input.value && !supportedAuthTypes.includes(input.value)) {
        input.onChange(undefined);
    }

    return (
        <React.Fragment>
            <Radio
                value={authName}
                isChecked={isSelected}
                name={name}
                onChange={() => input.onChange(authName)}
                label={label}
                id={`${name}-${index}`}
                isDisabled={isDisabled}
            />
            {isDisabled && <FormHelperText isHidden={false} className="pf-m-disabled">
                {application.display_name} does not support this authentication type.
            </FormHelperText>}
        </React.Fragment>
    );
};

AuthRadio.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    formOptions: PropTypes.any,
    input: PropTypes.shape({
        value: PropTypes.any,
        onChange: PropTypes.func,
        onBlur: PropTypes.func
    }).isRequired,
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired, //eslint-disable-line camelcase
        schema: PropTypes.shape({
            authentication: PropTypes.array,
            endpoint: PropTypes.object
        })
    })).isRequired,
    applicationTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired //eslint-disable-line camelcase
    })).isRequired,
    authName: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired
};

const AuthSelectProvider = ({ FieldProvider, ...rest }) =>
    (
        <FieldProvider { ...rest }>
            { (props) =>  <AuthRadio  { ...props } name={ props.input.name }/> }
        </FieldProvider>
    );

export default AuthSelectProvider;
