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

export default props => {

    let btnClasses = classNames(
      'pf-c-button',
      { [`pf-is-${props.type}`]: props.type !== undefined },
      { [`pf-is-${props.size}`]: props.size !== undefined },
      {
        'pf-has-focus': props.state === 'focused',
        [`pf-is-${props.state}`]: props.state === 'active' || props.state === 'disabled'
      }
    );

     return (
        <button
            className={btnClasses}
            disabled={(props.state === 'disabled' ? 'true' : undefined)}> {props.children} </button>
    );
}
