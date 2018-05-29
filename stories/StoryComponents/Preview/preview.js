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

    let previewClasses = classNames(
      'preview',
      [`preview-${props.type}`]
    );

     return (
        <div className={previewClasses}>
            <div className='preview__header'>{props.type}</div>
            <div className='preview__body'> {props.children} </div>
        </div>
    );
}
