import * as React from 'react';

export type SectionProps = Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'type'> & {
    className?: string;
    children: React.ReactNode;
    type?: string;
};

export declare const Section: React.FunctionComponent<SectionProps>;
