import React from 'react';
import propTypes from 'prop-types';

import './page-header.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */

class PageHeaderTitle extends React.Component {
  render () {
    return (
        <h1 className='ins-p-page-header__title'> {this.props.children} </h1>
    );
  }
};

export default PageHeaderTitle;

PageHeaderTitle.propTypes = {
  children: propTypes.element.isRequired
};
