import React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Breadcrumbs = () => {
    const { pathname } = useRouter();
    const fragments = pathname.split('/').filter(item => item.length > 0);
    return (
        <Breadcrumb>
            {fragments.length > 0 && (
                <BreadcrumbItem>
                    <Link href="/">
                      Home
                    </Link>
                </BreadcrumbItem>
            )}
            {fragments.map((fragment, index) => {
                const href = `/${fragments.slice(0, index + 1).join('/')}`;
                const isActive = index === fragments.length - 1;
                return (
                    <BreadcrumbItem
                        isActive={isActive}
                        href={href}
                        key={href}
                    >
                        {isActive ? fragment : <Link href={href}>{fragment}</Link>}
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumb>
    );

};

export default Breadcrumbs;
