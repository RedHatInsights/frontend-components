import React, { Component } from 'react';
import propTypes from 'prop-types';

import './ErrorStep.scss';

export default function ErrorStep ({ message = 'Error occured. Please try again later.' }) {
    return (
        <p className="ins-c-remediations-error-step">
            { message }
        </p>
    );
}

ErrorStep.propTypes = {
    message: propTypes.string
};
