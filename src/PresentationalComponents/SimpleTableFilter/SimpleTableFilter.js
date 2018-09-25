import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant, Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { Input } from '../Input';

class SimpleFilter extends Component {
    constructor(props) {
        super(props);
        this.onInputChange = this.onInputChange.bind(this);
        this.onFilterSubmit = this.onFilterSubmit.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.state = {
            activeFilter: '',
            isOpen: false
        };
    }

    onToggle(isOpen) {
        this.setState({
            isOpen
        });
    }

    onInputChange(event) {
        this.setState({ activeFilter: event.target.value });
        this.props.hasOwnProperty('onFilterChange') && this.props.onFilterChange(event.target.value, this.state.selected);
    }

    onFilterSubmit() {
        this.props.hasOwnProperty('onButtonClick') && this.props.onButtonClick(this.state.activeFilter, this.state.selected);
    }

    onSelect(event) {
        const { options } = this.props;
        this.setState({
            isOpen: false,
            selected: options.items.find(oneItem => oneItem.value === event.target.getAttribute('data-key'))
        });
        this.props.onOptionSelect && this.props.onOptionSelect(event);
    }

    render() {
        const {
            placeholder = 'Search items',
            buttonTitle = 'Filter',
            className = '',
            onButtonClick,
            onOptionSelect,
            onFilterChange,
            options,
            ...props
        } = this.props;
        const { isOpen, selected } = this.state;
        return (
            <div className={ `pf-c-input-group ${className}` } { ...props }>
                {
                    options &&
          <Dropdown
              onSelect={ this.onSelect }
              isOpen={ isOpen }
              toggle={
                  <DropdownToggle onToggle={ this.onToggle }>
                      { (selected && selected.title) || options.title || 'Dropdown' }
                  </DropdownToggle>
              }
          >
              { options.items.map(oneItem =>
                  <DropdownItem key={ oneItem.value } data-key={ oneItem.value }>{ oneItem.title }</DropdownItem>
              ) }
          </Dropdown>
                }
                <Input placeholder={ placeholder } onChange={ this.onInputChange }/>
                {
                    buttonTitle &&
                    <Button variant={ ButtonVariant.secondary } onClick={ this.onFilterSubmit }>{ buttonTitle }</Button>
                }
            </div>
        );
    }
}

SimpleFilter.propTypes = {
    buttonTitle: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    options: PropTypes.shape({
        title: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            title: PropTypes.string
        }))
    }),
    onButtonClick: PropTypes.func,
    onFilterChange: PropTypes.func,
    onOptionSelect: PropTypes.func
};

export default SimpleFilter;
