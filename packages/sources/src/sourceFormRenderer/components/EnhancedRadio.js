import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import Radio from '@data-driven-forms/pf4-component-mapper/dist/cjs/radio';

const EnhancedRadio = ({ mutator, options, ...props }) => {
    const formOptions = useFormApi();

    const values = formOptions.getState().values;

    const selectedType = values.source_type;
    const selectedApp = get(values, props.name);

    const newOptions = options.map((option) => mutator(option, formOptions)).filter(Boolean);

    useEffect(() => {
        if (selectedType) {
            formOptions.change(props.name, newOptions[0].value);
        } else if (selectedApp) {
            formOptions.change(props.name, undefined);
        }
    }, [ selectedType ]);

    return <Radio {...props} options={newOptions}/>;
};

EnhancedRadio.propTypes = {
    mutator: PropTypes.func.isRequired,
    options: PropTypes.array
};

export default EnhancedRadio;
