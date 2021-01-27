import * as React from 'react';

export type MainProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & {
    className?: string;
    children: React.ReactNode;
};

export declare const Main: React.FunctionComponent<MainProps>;
