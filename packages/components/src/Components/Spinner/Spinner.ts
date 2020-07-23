import * as React from 'react';

export type SpinnerProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & {
    centered?: boolean;
    className?: string;
};

export declare const Spinner: React.FunctionComponent<SpinnerProps>;
