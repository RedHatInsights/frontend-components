import React from 'react';
import { Skeleton as PFSkeleton, SkeletonProps as PFSkeletonProps } from '@patternfly/react-core';
import classNames from 'classnames';

import './skeleton.scss';

type SkeletonSizeType = { xs: 'xs'; sm: 'sm'; md: 'md'; lg: 'lg' };
export const SkeletonSize: SkeletonSizeType = { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg' };

export interface SkeletonProps extends Omit<PFSkeletonProps, 'size'> {
  size?: keyof SkeletonSizeType;
  isDark?: boolean;
}

const Skeleton: React.FunctionComponent<SkeletonProps> = ({ size = SkeletonSize.md, isDark = false, className, ...props }) => (
  <PFSkeleton className={classNames('ins-c-skeleton', `ins-c-skeleton__${size}`, { [`ins-m-dark`]: isDark }, className)} {...props} />
);

export default Skeleton;
