import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';
export const SkeletonSize = { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg' };

import './skeleton.scss';

const Skeleton = ({ size, className, ...props }) => {

    const skeletonClasses = classNames(
        'ins-c-skeleton',
        `ins-c-skeleton__${size}`,
        className
    );

    return (
        <div className={ skeletonClasses } { ...props }>&nbsp;</div>
    );
};

export default Skeleton;

Skeleton.propTypes = {
    className: propTypes.string,
    size: propTypes.oneOf([ 'xs', 'sm', 'md', 'lg' ])
};
