import React from 'react';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
export default props => {

    return (
        <div className='example'>
            <div class='example__header'>
                <h3 class='example__title'>{props.name}</h3>
            </div>
            <div class='example__body'>{props.children}</div>
        </div>
    );
}
