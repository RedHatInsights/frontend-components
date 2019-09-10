import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

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
        const { value, onChange, onSubmit, id, icon, className, ...props } = this.props;
        const Icon = icon || SearchIcon;
        const { stateValue } = this.state;
        const changeCallback = onChange ? onChange : this.onChangeValue;
        return (
            <Fragment>
                <TextInput { ...props }
                    className={`ins-c-conditional-filter ${className || ''}`}
                    id={ id }
                    value={ onChange ? value : stateValue }
                    onChange={ (_inputValue, e) => changeCallback(e, e.target.value) }
                    widget-type="InsightsInput"
                    onKeyDown={ e => e.key === 'Enter' && onSubmit(e, value || stateValue) }
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
    onSubmit: PropTypes.func
};

Text.defaultProps = {
    value: '',
    onSubmit: () => undefined
};

export default Text;
