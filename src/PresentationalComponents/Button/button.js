// This is the Patternfly-Next version of buttons

import React from 'react';

import classNames from 'classnames';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * Button Modifiers:
 *  Types = 'primary', 'secondary', 'tertiary' (default), 'danger'
 *  Sizes = 'small', 'large' NOTE: Default is medium, no modifier needed
 *  States = 'focused', 'active', 'disabled'
 */

class Button extends React.Component {
  render () {
    let btnClasses = classNames(
      'pf-c-button',
      { [`pf-is-${this.props.type}`]: this.props.type !== undefined },
      { [`pf-is-${this.props.size}`]: this.props.size !== undefined },
      {
        'pf-has-focus': this.props.state === 'focused',
        [`pf-is-${this.props.state}`]: this.props.state === 'active' || this.props.state === 'disabled'
      }
    );

     return (
        <button
            className={btnClasses}
            disabled={(this.props.state === 'disabled' ? 'true' : undefined)}> {this.props.children} </button>
    );
  }
}

export default Button;
