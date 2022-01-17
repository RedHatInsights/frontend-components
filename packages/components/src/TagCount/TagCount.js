import React from 'react';
import PropTypes from 'prop-types';
import './tagCount.scss';
import classNames from 'classnames';
import { Button } from '@patternfly/react-core';
import { TagIcon } from '@patternfly/react-icons';
import './tagCount.scss';

const TagCount = ({ count, onTagClick, className, ...props }) => {
  return (
    <Button {...props} variant="plain" isDisabled={!count} className={classNames('ins-c-tag-count', className)} onClick={onTagClick}>
      <TagIcon size="md" />
      <span className="ins-c-tag__text">{count}</span>
    </Button>
  );
};

TagCount.propTypes = {
  count: PropTypes.number,
  onTagClick: PropTypes.func,
  className: PropTypes.string,
};

TagCount.defaultProps = {
  onTagClick: () => undefined,
};

export default TagCount;
