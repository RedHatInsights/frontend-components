import React from 'react';
import PropTypes from 'prop-types';
import './tagCount.scss';
import { Button } from '@patternfly/react-core';
import { TagIcon } from '@patternfly/react-icons'

const TagCount = ({count, onTagClick, className, ...props}) => {
    return (
        <Button  {...props} variant="plain" className={`ins-c-tag-count ${className}`} onClick={onTagClick}>
            <TagIcon />
            <span>{count}</span>
        </Button>
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