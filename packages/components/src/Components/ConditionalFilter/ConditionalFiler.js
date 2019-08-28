import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class ConditionalFilter extends Component {
    state = {
        isOpen: false
    }

    dropdownToggle = (isOpen) => {
        this.setState({
            isOpen
        });
    }
    render() {
        return (
            <Fragment></Fragment>
        );
    }
}

ConditionalFilter.propTypes = {};
ConditionalFilter.defaultProps = {};
export default ConditionalFilter;
