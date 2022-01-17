import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant, Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { Input } from '../Input';
import { SearchIcon } from '@patternfly/react-icons';
import './simple-table-filter.scss';

class SimpleFilter extends Component {
  state = {
    activeFilter: '',
    isOpen: false,
  };

  onToggle = (isOpen) => {
    this.setState({
      isOpen,
    });
  };

  onInputChange = (event) => {
    this.setState({ activeFilter: event.target.value });
    this.props.onFilterChange(event.target.value, this.state.selected);
  };

  onFilterSubmit = () => {
    this.props.onButtonClick(this.state.activeFilter, this.state.selected);
  };

  onFilterSelect = (event, oneItem) => {
    this.setState({
      selected: oneItem,
    });
    this.props.onOptionSelect(event, oneItem);
  };

  onSelect = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { placeholder, buttonTitle, className, onButtonClick, onOptionSelect, onFilterChange, options, searchIcon, widgetId, ...props } =
      this.props;
    const { isOpen, selected } = this.state;
    const dropdownItems =
      options &&
      options.items &&
      options.items.map((oneItem) => (
        <DropdownItem component="button" key={oneItem.value} onClick={(event) => this.onFilterSelect(event, oneItem)} data-key={oneItem.value}>
          {oneItem.title}
        </DropdownItem>
      ));
    return (
      <div className={`pf-c-input-group ins-c-filter ${!buttonTitle ? 'ins-u-no-title' : ''} ${className}`} {...props}>
        {options && (
          <Dropdown
            onSelect={this.onSelect}
            isOpen={isOpen}
            toggle={<DropdownToggle onToggle={this.onToggle}>{(selected && selected.title) || options.title || 'Dropdown'}</DropdownToggle>}
            dropdownItems={dropdownItems}
          />
        )}
        <Input
          placeholder={placeholder}
          onKeyPress={(event) => event.key === 'Enter' && this.onInputChange(event)}
          widget-id={widgetId}
          onChange={this.onInputChange}
        />
        {!buttonTitle && searchIcon && <SearchIcon size="sm" className="ins-c-search-icon" />}
        {buttonTitle && (
          <Button variant={ButtonVariant.secondary} action="filter" onClick={this.onFilterSubmit}>
            {buttonTitle}
          </Button>
        )}
      </div>
    );
  }
}

SimpleFilter.propTypes = {
  widgetId: PropTypes.string,
  buttonTitle: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.shape({
    title: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        title: PropTypes.string,
      })
    ),
  }),
  onButtonClick: PropTypes.func,
  onFilterChange: PropTypes.func,
  onOptionSelect: PropTypes.func,
  searchIcon: PropTypes.bool,
};

SimpleFilter.defaultProps = {
  className: '',
  placeholder: 'Search items',
  buttonTitle: 'Filter',
  onButtonClick: () => undefined,
  onFilterChange: () => undefined,
  onOptionSelect: () => undefined,
  searchIcon: true,
};

export default SimpleFilter;
