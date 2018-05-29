import React from 'react';

import classNames from 'classnames';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * Alert Modifiers:
 *  Types = 'success', 'danger', 'warning', 'info'
 */

export default props => {

    let alertClasses = classNames(
      'pf-c-alert',
      [`pf-is-${props.type}`]
    );

     return (
        <div className={alertClasses} role='alert'> {props.children} </div>
    );
}
