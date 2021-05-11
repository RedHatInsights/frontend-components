import React, { useState } from 'react';
import { ApplicationLauncher, ApplicationLauncherItem, PageHeaderTools } from '@patternfly/react-core';
import sections from '../sections/sections-definition.json';
import Link from 'next/link';

const HeaderTools = () => {
    const [ isLauncherOpen, setLanucherOpen ] = useState(false);
    return (
        <PageHeaderTools>
            <ApplicationLauncher
                position="right"
                onSelect={() => setLanucherOpen(false)}
                onToggle={() => setLanucherOpen(prev => !prev)}
                isOpen={isLauncherOpen}
                items={sections.map(({ title, href }) => (
                    <ApplicationLauncherItem
                        key={title}
                        component={
                            <Link href={href || '#'}>
                                <a className="pf-c-app-launcher__menu-item" href={href || '#'}>
                                    {title}
                                </a>
                            </Link>
                        }
                    />
                ))}
            />
            <a href="https://github.com/RedHatInsights/frontend-components" rel="noopener noreferrer" target="_blank">
                <img src="/github-logo.svg" alt="Github logo" />
            </a>
        </PageHeaderTools>
    );
};

export default HeaderTools;
