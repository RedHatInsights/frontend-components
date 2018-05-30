import React from 'react';

import classNames from 'classnames';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
export default props => {

    return (
        <div className='preview'>
            <div class='preview__header'>
                <h4 class='preview__title'>{props.type}</h4>
            </div>
            <div class='preview__body'>{props.children}</div>
        </div>
    );
}
