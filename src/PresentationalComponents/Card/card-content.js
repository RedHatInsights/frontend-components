import React from 'react';
import './card.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
class CardContent extends React.Component {
  render () {
    return (
        <div className='ins-c-card__content'> {this.props.children} </div>
    );
  }
}

export default CardContent;
