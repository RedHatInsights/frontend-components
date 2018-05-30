import React from 'react';
import './page-header.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
export default class PageHeaderTitle extends React.Component {
  render () {
    return (
        <h1 className='ins-p-page-header__title'> {this.props.children} </h1>
    );
  }
}
