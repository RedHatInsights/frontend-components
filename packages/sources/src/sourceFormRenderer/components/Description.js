import React from 'react';
import PropTypes from 'prop-types';

const Description = ({ name, content, className, formOptions, assignFormOptions }) => <div className={ className } id={ name }>
    {assignFormOptions ? React.cloneElement(
        content,
        { formOptions }
    ) : content}
</div>;

Description.propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    className: PropTypes.string,
    assignFormOptions: PropTypes.bool
};

Description.defaultProps = {
    className: undefined
};

export default Description;
