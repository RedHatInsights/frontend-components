import React from 'react';

import classNames from 'classnames';

import './section.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * Section Modifiers:
 *  Types = 'content'
 */

export default props => {

    let sectionClasses = classNames(
      { [`ins-l-${props.type}`]: props.type !== undefined }
    );

     return (
        <section className={sectionClasses}> {props.children} </section>
    );
}
