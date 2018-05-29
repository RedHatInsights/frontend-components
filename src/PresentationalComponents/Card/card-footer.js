import React from 'react';
import './card.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
export default props => {
    return (
        <div className='ins-c-card__footer'> {props.children} </div>
    );
}
