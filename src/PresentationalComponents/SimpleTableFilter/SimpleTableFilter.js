import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant } from '@patternfly/react-core';

class SimpleFilter extends Component {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onFilterSubmit = this.onFilterSubmit.bind(this);
    this.state = {
      activeFilter: ''
    }
  }

  onInputChange(event) {
    this.setState({ activeFilter: event.target.value });
    this.props.hasOwnProperty('onFilterChange') && this.props.onFilterChange(this.state.activeFilter);
  }

  onFilterSubmit() {
    this.props.hasOwnProperty('onButtonClick') && this.props.onButtonClick(this.state.activeFilter);
  }

  render() {
    const {
      placeholder = 'Search items',
      buttonTitle = 'Filter',
      className = '',
      onButtonClick,
      onFilterChange,
      ...props
    } = this.props;
    return (
      <div className={`pf-c-input-group ${className}`} {...props}>
        <input className="pf-c-form-control" type="text" placeholder={placeholder} onChange={this.onInputChange}/>
        {buttonTitle && <Button variant={ButtonVariant.secondary} onClick={this.onFilterSubmit}>{buttonTitle}</Button>}
      </div>
    )
  }
}

SimpleFilter.propTypes = {
  buttonTitle: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onButtonClick: PropTypes.func,
  onFilterChange: PropTypes.func
}

export default SimpleFilter;