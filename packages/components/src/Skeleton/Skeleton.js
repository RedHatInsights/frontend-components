import React from 'react';
import propTypes from 'prop-types';
import { Skeleton as PFSkeleton } from '@patternfly/react-core';
import classNames from 'classnames';

export const SkeletonSize = { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg' };

import './skeleton.scss';

const Skeleton = ({ size, isDark, className, ...props }) => (
    <PFSkeleton className={ classNames(
        'ins-c-skeleton',
        `ins-c-skeleton__${size}`,
        { [`ins-m-dark`]: isDark },
        className
    ) } { ...props } />
);

export default Skeleton;

Skeleton.propTypes = {
    className: propTypes.string,
    size: propTypes.oneOf(Object.values(SkeletonSize)),
    isDark: propTypes.bool
};

Skeleton.defaultProps = {
    size: SkeletonSize.md,
    isDark: false
};
