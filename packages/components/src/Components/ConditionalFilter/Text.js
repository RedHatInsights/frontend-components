import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@patternfly/react-core';

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
        const { value, onChange, onSubmit, id, ...props } = this.props;
        const { stateValue } = this.state;
        const changeCallback = onChange ? onChange : this.onChangeValue;
        return (
            <TextInput { ...props }
                id={ id }
                value={ onChange ? value : stateValue }
                onChange={ (_inputValue, e) => changeCallback(e, e.target.value) }
                widget-type="InsightsInput"
                onKeyDown={ e => e.key === 'Enter' && onSubmit(e, value || stateValue) }
            />
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
