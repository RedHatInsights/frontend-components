import React from 'react';

import classNames from 'classnames';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * Alert Modifiers:
 *  Types = 'success', 'danger', 'warning', 'info'
 */

<<<<<<< Updated upstream
export default props => {
=======
export default class Alert extends React.Component {
>>>>>>> Stashed changes

    let alertClasses = classNames(
      'pf-c-alert',
      [`pf-is-${props.type}`]
    );

<<<<<<< Updated upstream
     return (
        <div className={alertClasses} role='alert'> {props.children} </div>
    );
}
=======
        return (
            <div className={alertClasses} role='alert'> {props.children} </div>
        );
    }
};
>>>>>>> Stashed changes
