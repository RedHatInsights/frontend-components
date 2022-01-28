import React from 'react';
import PropTypes from 'prop-types';

const SampleComponent = (props) => {
  return <span> {props.children} </span>;
};

SampleComponent.propTypes = {
  children: PropTypes.node,
};

export default SampleComponent;
