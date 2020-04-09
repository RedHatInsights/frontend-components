import React from 'react';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

export const AuthDescription = () => (<TextContent>
    <Text component={TextVariants.p} className="pf-u-mb-l">
    Provide Ansible Tower service account user credentials to ensure
    optimized availability of resources to Catalog Administrators.
    </Text>
    <Text component={TextVariants.p} className="ins-c-sources__wizard--all-required-text">
    All fields are required.
    </Text>
</TextContent>);

export const EndpointDescription = () => (<TextContent>
    <Text component={TextVariants.p} className="pf-u-mb-l">
Enter the hostname of the Ansible Tower instance you want to connect to.
    </Text>
</TextContent>);
