import React from 'react';
import { TextContent, TextList, TextListItem, Text, TextVariants, ClipboardCopy } from '@patternfly/react-core';

export const DescriptionSummary = () => (<TextContent key='1'>
    <Text component={ TextVariants.p }>
    An OpenShift Container Platform login token is required to communicate with the application.
    </Text>
    <Text component={ TextVariants.p }>
        To collect data from a Red Hat OpenShift Container Platform source:
    </Text>
    <TextContent>
        <TextList component='ul'>
            <TextListItem component='li' key='1'>
                Log in to the Red Hat OpenShift Container Platform cluster with an account
                    that has access to the namespace
            </TextListItem>
            <TextListItem component='li' key='2'>
                Run the following command to obtain your login token:
            </TextListItem>
            <ClipboardCopy className="pf-u-mb-md" isReadOnly># oc sa get-token -n management-infra management-admin</ClipboardCopy>
            <TextListItem component='li' key='3'>
                Copy the token and paste it in the Token field:
            </TextListItem>
        </TextList>
    </TextContent>
</TextContent>);
