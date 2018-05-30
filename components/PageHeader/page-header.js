import React from 'react';
import './page-header.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
export default class PageHeader extends React.Component {
  render () {
    return (
        <header className='ins-p-page-header'> {this.props.children} </header>
    );
  }
}
