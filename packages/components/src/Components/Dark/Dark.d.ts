import * as React from 'react';
declare type DarkContextValue = 'light' | 'dark';

declare type DarkProps = {
    children: React.ReactNode;
}

export declare const Dark: React.FunctionComponent<DarkProps>;

export declare const DarkContext: React.Context<DarkContextValue>;
