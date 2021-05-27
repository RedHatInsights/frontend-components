import * as React from 'react';
export declare type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg';
export declare type SkeletonProps = Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'size'> & {
    className?: string;
    size?: SkeletonSize;
    isDark?: boolean;
};
export declare const Skeleton: React.FunctionComponent<SkeletonProps>;
