import React from 'react';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { useIntl } from 'react-intl';

export const AuthDescription = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={TextVariants.p} className="pf-u-mb-l">
            { intl.formatMessage({
                id: 'catalog.auth.provideTowerCredentials',
                defaultMessage: 'Provide Ansible Tower service account user credentials to ensure optimized availability of resources to Catalog Administrators.'
            }) }
        </Text>
        <Text component={TextVariants.p} className="ins-c-sources__wizard--all-required-text">
            { intl.formatMessage({
                id: 'catalog.auth.allFieldsRequired',
                defaultMessage: 'All fields are required.'
            }) }
        </Text>
    </TextContent>);
};

export const EndpointDescription = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={TextVariants.p} className="pf-u-mb-l">
            { intl.formatMessage({
                id: 'catalog.endpoint.enterHostname',
                defaultMessage: 'Enter the hostname of the Ansible Tower instance you want to connect to.'
            }) }
        </Text>
    </TextContent>);
};
