import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const DropdownPosition = {
  left: 'left',
  right: 'right'
}

export const DropdownDirection = {
  up: 'up',
  down: 'down'
}

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.onDropdownClick = this.onDropdownClick.bind(this);
    this.onDocClick = this.onDocClick.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.onDocClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onDocClick);
  }

  onDocClick(event) {
    if (this.ref && !this.ref.contains(event.target)) {
      this.onDropdownClick(event, !this.props.isCollapsed);
    }
  }

  onDropdownClick(event, toggleEvent = false) {
    if (event.target.classList.contains('pf-c-dropdown__toggle') || toggleEvent) {
      this.props.onToggle && this.props.onToggle(event);
    } else if (event.target.classList.contains('pf-c-dropdown__menu-item')) {
      this.props.onSelect && this.props.onSelect(event);
    }
  }

  render() {
    const {
      position,
      direction,
      isKebab,
      className,
      title,
      hasArrow = true,
      isCollapsed,
      onSelect,
      children,
      airaLabelledBy,
      onToggle,
      ...props
    } = this.props;

    const classes = classNames(
      'pf-c-dropdown',
      direction === DropdownDirection.up && 'pf-m-dropup',
      position === DropdownPosition.right && 'pf-m-right-aligned',
      hasArrow || 'pf-m-no-arrow',
      isCollapsed || 'pf-m-expanded',
      isKebab && 'pf-m-action pf-m-no-arrow',
      className
    )

    return (
      <div {...props} onClick={this.onDropdownClick} className={classes} ref={ref => this.ref = ref}>
        <button className="pf-c-dropdown__toggle" aria-haspopup="true" aria-expanded={!isCollapsed}>
          {isKebab ?
             <i className="fas fa-ellipsis-v"></i>
             : title
          }
        </button>
        <div
          className="pf-c-dropdown__menu"
          role="menu"
          hidden={isCollapsed}
          aria-labelledby={airaLabelledBy}
        >
          {children}
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  position: PropTypes.oneOf(Object.keys(DropdownPosition)),
  direction: PropTypes.oneOf(Object.keys(DropdownDirection)),
  isKebab: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool,
  hasArrow: PropTypes.bool,
  onSelect: PropTypes.func,
  airaLabelledBy: PropTypes.string,
  onToggle: PropTypes.func
}

export default Dropdown;