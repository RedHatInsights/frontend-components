import React from 'react';
import './page-header.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
export default props => {
    return (
        <header className='ins-p-page-header'> {props.children} </header>
    );
}
