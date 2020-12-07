import React from 'react';
import PropTypes from 'prop-types';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import Select from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';

const EnhancedSelect = ({ mutator, options, ...props }) => {
    const formOptions = useFormApi();

    return <Select {...props} options={options.map((option) => mutator(option, formOptions))}/>;
};

EnhancedSelect.propTypes = {
    mutator: PropTypes.func.isRequired,
    options: PropTypes.array
};

export default EnhancedSelect;
