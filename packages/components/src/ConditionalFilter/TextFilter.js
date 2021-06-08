import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import './conditional-filter.scss';

class Text extends Component {
    state = {
        stateValue: ''
    }

    onChangeValue = (e, value) => {
        this.setState({
            stateValue: value
        });
    }

    render() {
        const { value, onChange, onSubmit, id, icon, className, isDisabled, ...props } = this.props;
        const Icon = icon || SearchIcon;
        const { stateValue } = this.state;
        const changeCallback = onChange ? onChange : this.onChangeValue;
        return (
            <Fragment>
                <TextInput
                    { ...props }
                    className={`ins-c-conditional-filter ${className || ''}`}
                    id={ id }
                    isDisabled={ isDisabled }
                    value={ onChange ? value : stateValue }
                    onChange={ (_inputValue, e) => changeCallback(e, e.target.value) }
                    widget-type="InsightsInput"
                    onKeyDown={ e => e.key === 'Enter' && onSubmit(e, value || stateValue) }
                    data-ouia-component-type="PF4/TextInput"
                />
                <Icon size="sm" className="ins-c-search-icon" />
            </Fragment>

        );
    }
}

Text.propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    isDisabled: PropTypes.bool,
    'aria-label': PropTypes.string,
    id: PropTypes.string,
    icon: PropTypes.elementType,
    className: PropTypes.string
};

Text.defaultProps = {
    value: '',
    onSubmit: () => undefined,
    isDisabled: false,
    'aria-label': 'text input'
};

export default Text;
