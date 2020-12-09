import React from 'react';
import { PageHeaderTools } from '@patternfly/react-core';

const HeaderTools = () => {
    return (
        <PageHeaderTools>
            <a href="https://github.com/RedHatInsights/frontend-components" rel="noopener noreferrer" target="_blank">
                <img src="/github-logo.svg" alt="Github logo" />
            </a>
        </PageHeaderTools>
    );
};

export default HeaderTools;
