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

export default class SampleComponent extends React.Component {

  render () {
    let sectionClasses = classNames(
      { [`ins-l-${this.props.type}`]: this.props.type !== undefined }
    );

     return (
        <section className={sectionClasses}> {this.props.children} </section>
    );
  }
}
