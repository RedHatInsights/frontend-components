import * as React from 'react';

declare type SpinnerProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & {
    centered?: boolean;
    className?: string;
};

export declare const Spinner: React.FunctionComponent<SpinnerProps>;
