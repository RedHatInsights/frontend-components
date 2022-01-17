import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant, Radio as InputRadio } from '@patternfly/react-core';
import Text from './TextFilter';

class Radio extends Component {
  state = {
    isExpanded: false,
    checked: undefined,
  };

  onToggle = (isExpanded) => {
    this.setState({
      isExpanded,
    });
  };

  calculateSelected = () => {
    const { checked } = this.state;
    const { value: selectedValue } = this.props;
    return (selectedValue && (selectedValue.value || selectedValue)) || (checked && (checked.value || checked));
  };

  onSelect = (event, selection) => {
    const { onChange } = this.props;
    onChange(event, selection);
    this.setState({ checked: selection });
  };

  render() {
    const { isExpanded } = this.state;
    const { items, placeholder, isDisabled, className } = this.props;
    const checkedValue = this.calculateSelected();
    return (
      <Fragment>
        {!items || (items && items.length <= 0) ? (
          <Text {...this.props} value={`${this.calculateSelected()}`} />
        ) : (
          <Select
            className={className}
            variant={SelectVariant.single}
            aria-label="Select Input"
            isDisabled={isDisabled}
            onToggle={this.onToggle}
            onSelect={this.onSelect}
            isOpen={isExpanded}
            placeholderText={placeholder}
            ouiaId={placeholder}
          >
            {items.map(({ value, isChecked, onChange, label, id, ...item }, key) => (
              <SelectOption {...item} key={id || key} value={value || '' + key}>
                <InputRadio
                  {...item}
                  name={id || `${key}-radio`}
                  label={label}
                  value={value || key}
                  isChecked={
                    isChecked ||
                    (checkedValue !== undefined && checkedValue === value) ||
                    (checkedValue !== undefined && checkedValue === '' + key) ||
                    false
                  }
                  onChange={(_value, e) => onChange && onChange(e, { id, label, value, isChecked, ...item }, key)}
                  id={id || `${value}-${key}`}
                />
              </SelectOption>
            ))}
          </Select>
        )}
      </Fragment>
    );
  }
}

Radio.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.string,
    }),
  ]),
  placeholder: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.node,
      id: PropTypes.string,
      isChecked: PropTypes.bool,
      onChange: PropTypes.func,
    })
  ),
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
};

Radio.defaultProps = {
  items: [],
  onChange: () => undefined,
  isDisabled: false,
};

export default Radio;
