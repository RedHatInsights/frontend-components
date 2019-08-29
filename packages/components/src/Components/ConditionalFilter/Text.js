import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        const { value, onChange, onSubmit, ...props } = this.props;
        const { stateValue } = this.state;
        const changeCallback = onChange ? onChange : this.onChangeValue;
        return (
            <input { ...props }
                value={ onChange ? value : stateValue }
                className="pf-c-form-control"
                onChange={ (e) => changeCallback(e, event.target.value) }
                widget-type="InsightsInput"
                onKeyDown={ e => e.key === 'Enter' && onSubmit(e, stateValue) }
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
