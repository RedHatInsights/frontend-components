import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import Radio from '@data-driven-forms/pf4-component-mapper/dist/esm/radio';

const EnhancedRadio = ({ options, mutator, ...props }) => {
    const formOptions = useFormApi();

    const values = formOptions.getState().values;

    const selectedType = values.source_type;
    const selectedApp = get(values, props.name);

    const newOptions = options.map((option) => mutator(option, formOptions)).filter(Boolean);

    useEffect(() => {
        if (
            selectedType &&
            (!selectedApp || !newOptions.map(({ value }) => value).includes(selectedApp))
            && newOptions.length === 1
        ) {
            formOptions.change(props.name, newOptions[0].value);
        } else if (!newOptions.map(({ value }) => value).includes(selectedApp)) {
            formOptions.change(props.name, undefined);
        }
    }, [ selectedType ]);

    return (
        <Radio {...props} options={newOptions} FormGroupProps={{ className: 'ins-c-sources__wizard--radio' }}/>
    );
};

EnhancedRadio.propTypes = {
    mutator: PropTypes.func.isRequired,
    options: PropTypes.array
};

export default EnhancedRadio;
