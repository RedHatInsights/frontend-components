import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './tagCount.scss';

const TagCount = ({count, onTagClick, className, ...props}) => {
    return (
        <div {...props} className={classNames("ins-c-tag-count", className)} onClick={onTagClick}>
            <i className="fas fa-tag"></i>
            <span>{count}</span>
        </div>
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