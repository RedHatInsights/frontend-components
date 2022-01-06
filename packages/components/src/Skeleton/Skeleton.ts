import * as React from 'react';
import { SkeletonProps as PFSkeletonProps } from '@patternfly/react-core';

export type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg';

export type SkeletonProps =  PFSkeletonProps & {
    size?: SkeletonSize;
    isDark?: boolean;
};

export declare const Skeleton: React.FunctionComponent<SkeletonProps>;
