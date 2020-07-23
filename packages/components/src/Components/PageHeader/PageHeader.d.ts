import * as React from 'react';

declare type PageHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & {
    className?: string;
    children: React.ReactNode;
};

export declare const PageHeader: React.FunctionComponent<PageHeaderProps>;

declare type PageHeaderTitleProps = Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'title'> & {
    className?: string;
    title: React.ReactNode;
};

export declare const PageHeaderTitle: React.FunctionComponent<PageHeaderTitleProps>;

export {};
