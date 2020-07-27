import React from 'react';
import { TextContent, TextList, TextListItem, Text, TextVariants, ClipboardCopy } from '@patternfly/react-core';
import { useIntl } from 'react-intl';

export const DescriptionSummary = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'openshift.token.description',
                defaultMessage: 'An OpenShift Container Platform login token is required to communicate with the application.'
            }) }
        </Text>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'openshift.token.collectData',
                defaultMessage: 'To collect data from a Red Hat OpenShift Container Platform source:'
            }) }

        </Text>
        <TextList component='ul'>
            <TextListItem component='li'>
                { intl.formatMessage({
                    id: 'openshift.token.logIn',
                    defaultMessage: 'Log in to the Red Hat OpenShift Container Platform cluster with an account that has access to the namespace'
                }) }
            </TextListItem>
            <TextListItem component='li'>
                { intl.formatMessage({
                    id: 'openshift.token.runCommand',
                    defaultMessage: 'Run the following command to obtain your login token:'
                }) }
            </TextListItem>
            <ClipboardCopy className="pf-u-mb-md" isReadOnly>
                { intl.formatMessage({
                    id: 'openshift.token.comman',
                    defaultMessage: '# oc sa get-token -n management-infra management-admin'
                }) }
            </ClipboardCopy>
            <TextListItem component='li'>
                { intl.formatMessage({
                    id: 'openshift.token.copyToken',
                    defaultMessage: 'Copy the token and paste it in the Token field:'
                }) }
            </TextListItem>
        </TextList>
    </TextContent>);
};
