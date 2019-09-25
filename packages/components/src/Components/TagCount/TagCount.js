import React from 'react';
import PropTypes from 'prop-types';
import './tagCount.scss';

const TagCount = ({count, onTagClick, className, ...props}) => {
    return (
        <button {...props} className={`ins-c-tag-count ${className}`} onClick={onTagClick}>
            <i className="fas fa-tag"></i>
            <span>{count}</span>
        </button>
    )
}

TagCount.propTypes = {
    count: PropTypes.number,
    onTagClick: PropTypes.func
};

TagCount.defaultProps = {
    onTagClick: () => undefined
};

export default TagCount;