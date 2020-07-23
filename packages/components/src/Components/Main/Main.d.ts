import * as React from 'react';

// Note: index.js exports the connected version as Main, and not the class 'Main', ignoring params and path.

declare type MainProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & {
    className?: string;
    children: React.ReactNode;
};

export declare const Main: React.FunctionComponent<MainProps>;

export {};
