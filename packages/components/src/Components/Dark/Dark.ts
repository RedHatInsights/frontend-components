import * as React from 'react';
export type DarkContextValue = 'light' | 'dark';

export type DarkProps = {
    children: React.ReactNode;
}

export declare const Dark: React.FunctionComponent<DarkProps>;

export declare const DarkContext: React.Context<DarkContextValue>;
