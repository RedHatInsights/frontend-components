import React, { Component } from 'react';
import { Checkbox, Radio } from '@patternfly/react-core';
import PropTypes from 'prop-types';

class FilterInput extends Component {
    state = {
        checked: false
    };

    componentDidMount() {
        const { type, filters, param, value } = this.props;
        switch (type) {
            case 'checkbox':
                param in filters && filters[param] && filters[param].includes(value)
                    ? this.setState({ checked: true }) : this.setState({ checked: false });
                break;
        }
    }

    handleChange = checked => {
        const { type, addRemoveFilters, param, value } = this.props;
        let updateState;
        switch (type) {
            case 'checkbox':
                updateState = { checked: !this.state.checked };
                break;
        }

        this.setState({ ...updateState });
        addRemoveFilters(value, param, type, checked);
    };

    render() {
        const { label, id, param, value, type, filters } = this.props;
        const { checked } = this.state;

        return (() => {
            switch (type) {
                case 'checkbox':
                    return (
                        <Checkbox
                            aria-label={ label }
                            id={ id }
                            isChecked={ checked }
                            label={ label }
                            onChange={ this.handleChange }
                            param={ param }
                            value={ value }
                            ouiaId={ label }
                        />
                    );
                case 'radio':
                    return (
                        <Radio
                            isChecked={ filters[param] === value }
                            aria-label={ label }
                            id={ id }
                            label={ label }
                            name={ param }
                            onChange={ this.handleChange }
                            param={ param }
                            value={ value }
                            ouiaId={ label }
                        />
                    );
            }
        })();
    }
}

FilterInput.propTypes = {
    addRemoveFilters: PropTypes.func,
    className: PropTypes.string,
    currentPage: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    param: PropTypes.string,
    value: PropTypes.any,
    filters: PropTypes.object,
    type: PropTypes.string
};

FilterInput.defaultProps = {
    addRemoveFilters: Function.prototype,
    className: null,
    currentPage: null,
    param: null,
    filters: {},
    type: 'checkbox',
    value: undefined
};

export default FilterInput;
