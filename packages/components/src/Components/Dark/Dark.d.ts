import * as React from 'react';
export declare type DarkContextValue = 'light' | 'dark';
export declare type DarkProps = {
    children: React.ReactNode;
};
export declare const Dark: React.FunctionComponent<DarkProps>;
export declare const DarkContext: React.Context<DarkContextValue>;
