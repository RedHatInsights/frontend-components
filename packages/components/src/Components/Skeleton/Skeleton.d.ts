import * as React from 'react';

export type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg';

export type SkeletonProps = Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'size'> & {
    className?: string;
    size?: SkeletonSize;
    isDark?: boolean;
};

declare var Skeleton: React.FunctionComponent<SkeletonProps>;
