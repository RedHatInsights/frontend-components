import React from 'react';
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const Loader = ({ name, size, FieldProvider, validate, FormSpyProvider, formOptions, ...rest }) => (
    <div { ...rest } >
        <Skeleton size={ size }></Skeleton>
    </div>
);

Loader.propTypes = {
    FieldProvider: PropTypes.any,
    formOptions: PropTypes.any,
    FormSpyProvider: PropTypes.any,
    validate: PropTypes.any,
    name: PropTypes.string,
    size: PropTypes.string
};

Loader.defaultProps = {
    name: '',
    size: 'md'
};

export default Loader;
