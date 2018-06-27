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

class Section extends React.Component {

  render () {
    let sectionClasses = classNames(
      { [`ins-l-${this.props.type}`]: this.props.type !== undefined }
    );

     return (
        <section className={sectionClasses}> {this.props.children} </section>
    );
  }
};

export default Section;

Section.propTypes = {
  type: propTypes.string,
  children: propTypes.any.isRequired
};
