import React, { PureComponent } from 'react';
import propTypes from 'prop-types';

import './ErrorStep.scss';

export default class ErrorStep extends PureComponent {

    componentDidMount() {
        this.props.onValidChange(false);
    }

    componentWillUnmount () {
        this.props.onValidChange(true);
    }

    render () {
        return (
            <div className="ins-c-remediations-error-step">
                <h1 className='ins-m-text__bold ins-m-red'>Unexpected error. Please try again later</h1>
                <ul>
                    {
                        this.props.errors.map((e, i) => <li key={ i }>{ e }</li>)
                    }
                </ul>
            </div>
        );
    }
}

ErrorStep.propTypes = {
    errors: propTypes.array.isRequired,
    onValidChange: propTypes.func.isRequired
};

ErrorStep.defaultProps = {
    errors: []
};
