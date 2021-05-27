import * as React from 'react';
export declare type SpinnerProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & {
    centered?: boolean;
    className?: string;
};
export declare const Spinner: React.FunctionComponent<SpinnerProps>;
