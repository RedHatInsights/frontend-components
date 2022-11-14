import './sample-component.scss';
import React from 'react';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
const SampleComponent: React.FC = (props) => {
  return <span className="sample-component"> {props.children} </span>;
};

SampleComponent.displayName = 'SampleComponent';

export default SampleComponent;
