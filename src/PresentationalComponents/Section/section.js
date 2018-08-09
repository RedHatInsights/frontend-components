import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

import './section.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * Section Modifiers:
 *  Types = 'content'
 */

const Section = ({ type, children, className, ...props }) => {

    let sectionClasses = classNames(
        className,
        { [`ins-l-${type}`]: type !== undefined }
    );

     return (
        <section {...props} className={sectionClasses}> {children} </section>
    );
};

export default Section;

Section.propTypes = {
  type: propTypes.string,
  className: propTypes.string,
  children: propTypes.any.isRequired
};
