import React from 'react';
import { TextContent, TextList, TextListItem, Text, TextVariants } from '@patternfly/react-core';

export const DescriptionSummary = () => (<TextContent key='1'>
    <Text component={ TextVariants.p }>
        Add credentials that enable communication with this source.
            This source requires the login token.
    </Text>
    <Text component={ TextVariants.p }>
        To collect data from a Red Hat OpenShift Container Platform source,
    </Text>
    <TextContent>
        <TextList component='ul'>
            <TextListItem component='li' key='1'>
                Log in to the Red Hat OpenShift Container Platform cluster with an account
                    that has access to the namespace
            </TextListItem>
            <TextListItem component='li' key='2'>
                Run the following command to obtain your login token:
                <b>&nbsp;# oc sa get-token -n management-infra management-admin</b>
            </TextListItem>
            <TextListItem component='li' key='3'>
                Copy the token and paste it in the following field.
            </TextListItem>
        </TextList>
    </TextContent>
</TextContent>);
