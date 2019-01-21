import React, { Component } from 'react';
import propTypes from 'prop-types';

import './ErrorStep.scss';

export default function ErrorStep ({ errors }) {
    return (
        <div className="ins-c-remediations-error-step">
            <h1 className='ins-m-text__bold'>Unexpected error. Please try again later</h1>
            <ul>
                {
                    errors.map((e, i) => <li key={ i }>{ e }</li>)
                }
            </ul>
        </div>
    );
}

ErrorStep.propTypes = {
    errors: propTypes.array.isRequired
};

ErrorStep.defaultProps = {
    errors: []
};
