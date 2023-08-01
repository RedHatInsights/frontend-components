import React from 'react';
import classNames from 'classnames';
import { Button, ButtonProps, Icon } from '@patternfly/react-core';
import { TagIcon } from '@patternfly/react-icons';

import './tagCount.scss';

export interface TagCountProps extends ButtonProps {
  count?: number;
  onTagClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const TagCount: React.FunctionComponent<TagCountProps> = ({ count, onTagClick = () => undefined, className, ...props }) => {
  return (
    <Button {...props} variant="plain" isDisabled={!count} className={classNames('ins-c-tag-count', className)} onClick={onTagClick}>
      <Icon size="md">
        <TagIcon />
      </Icon>
      <span className="ins-c-tag__text">{count}</span>
    </Button>
  );
};

export default TagCount;
