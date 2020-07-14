import React from 'react';
import { TextContent, TextList, TextListItem, Text, TextVariants, ClipboardCopy } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

export const DescriptionSummary = () => (<TextContent key='1'>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="wizard.AnOpenshiftContainerPlatformLoginTokenIsRequiredToCommunicateWithTheApplication"
            defaultMessage="An OpenShift Container Platform login token is required to communicate with the application."
        />
    </Text>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="wizard.ToCollectDataFromARedHatOpenshiftContainerPlatformSource"
            defaultMessage="To collect data from a Red Hat OpenShift Container Platform source:"
        />
    </Text>
    <TextList component='ul'>
        <TextListItem component='li' key='1'>
            <FormattedMessage
                id="wizard.LogInToTheRedHatOpenshiftContainerPlatformClusterWithAnAccountThatHasAccessToTheNamespace"
                defaultMessage="Log in to the Red Hat OpenShift Container Platform cluster with an account that has access to the namespace"
            />
        </TextListItem>
        <TextListItem component='li' key='2'>
            <FormattedMessage
                id="wizard.RunTheFollowingCommandToObtainYourLoginToken"
                defaultMessage="Run the following command to obtain your login token:"
            />
        </TextListItem>
        <ClipboardCopy className="pf-u-mb-md" isReadOnly>
            <FormattedMessage id="wizard.OcSaGetTokenNManagementInfraManagementAdmin" defaultMessage="# oc sa get-token -n management-infra management-admin" />
        </ClipboardCopy>
        <TextListItem component='li' key='3'>
            <FormattedMessage
                id="wizard.CopyTheTokenAndPasteItInTheTokenField"
                defaultMessage="Copy the token and paste it in the Token field:"
            />
        </TextListItem>
    </TextList>
</TextContent>);
