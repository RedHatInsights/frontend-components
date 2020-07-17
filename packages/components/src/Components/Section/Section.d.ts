import * as React from 'react';

declare type SectionProps = Omit<React.HTMLAttributes<React.HTMLElement>, 'className' | 'type'> & {
    className?: string;
    children: React.ReactNode;
    type?: string;
};

declare var Section: React.FunctionComponent<SectionProps>;
