import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

const ValidatorReset = ({ name }) => {
    const formOptions = useFormApi();

    useEffect(() => {
        setTimeout(() => formOptions.change(name, '1'));

        return () => formOptions.change(name, '');
    }, []);

    return null;
};

ValidatorReset.propTypes = {
    name: PropTypes.string.isRequired
};

export default ValidatorReset;
