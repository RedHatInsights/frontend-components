import React from 'react';
import PropTypes from 'prop-types';

const Description = ({ name, Content, className, formOptions, assignFormOptions }) => <div className={ className } id={ name }>
    {assignFormOptions ? <Content formOptions={formOptions} /> : <Content />}
</div>;

Description.propTypes = {
    name: PropTypes.string.isRequired,
    Content: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]).isRequired,
    className: PropTypes.string,
    assignFormOptions: PropTypes.bool,
    formOptions: PropTypes.shape({
        getState: PropTypes.func.isRequired
    }).isRequired
};

Description.defaultProps = {
    className: undefined
};

export default Description;
