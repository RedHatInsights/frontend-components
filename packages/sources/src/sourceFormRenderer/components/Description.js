import React from 'react';
import PropTypes from 'prop-types';

const Description = ({ Content, ...rest }) => <Content {...rest}/>;

Description.propTypes = {
    Content: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]).isRequired
};

export default Description;
