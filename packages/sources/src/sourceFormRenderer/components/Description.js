import React from 'react';
import PropTypes from 'prop-types';

const Description = ({ name, content, className }) => <div className={ className } id={ name }>
    { content }
</div>;

Description.propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    className: PropTypes.string
};

Description.defaultProps = {
    className: undefined
};

export default Description;
