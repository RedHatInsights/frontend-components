import React, { useState, useEffect } from 'react';
import {
    TextContent,
    Text,
    TextVariants,
    TextList,
    TextListItem,
    ClipboardCopy,
    ClipboardCopyVariant
} from '@patternfly/react-core';
import { FormattedMessage, useIntl } from 'react-intl';

import { getSubWatchConfig } from '../../../api/subscriptionWatch';

export const IAMRoleDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="wizard.ToDelegateAccountAccessCreateAnIamRoleToAssociateWithYourIamPolicy"
            defaultMessage="To delegate account access, create an IAM role to associate with your IAM policy."
        />
    </Text>
    <TextList>
        <TextListItem>
            <FormattedMessage
                id="wizard.FromTheAwsIdentityAccessManagementConsoleCreateANewRole"
                defaultMessage="From the AWS Identity access management console, create a new role."
            />
        </TextListItem>
        <TextListItem>
            <FormattedMessage
                id="wizard.SelectAnotherAwsAccountFromTheListOfTrustedEntitiesAndPasteTheFollowingValueIntoTheAccountIdField"
                defaultMessage="Select another AWS account from the list of trusted entities and paste the following value into the Account ID field:"
            />
        </TextListItem>
        <ClipboardCopy className="pf-u-m-sm-on-sm" isReadOnly>
        372779871274
        </ClipboardCopy>
        <TextListItem>
            <FormattedMessage
                id="wizard.AttachThePermissionsPolicyThatYouJustCreated"
                defaultMessage="Attach the permissions policy that you just created."
            />
        </TextListItem>
        <TextListItem><FormattedMessage id="wizard.CompleteTheProcessToCreateYourNewRole" defaultMessage="Complete the process to create your new role." /></TextListItem>
    </TextList>
</TextContent>);

export const IAMPolicyDescription = () =>  {
    const intl = useIntl();
    const [ config, setConfig ] = useState();

    useEffect(() => {
        getSubWatchConfig().then((conf) => setConfig(conf)).catch((e) => {
            console.error(e);
            setConfig(intl.formatMessage({
                id: 'wizard.subWatchConfigError',
                defaultMessage: 'There is an error with loading of the configuration. Please go back and return to this step.'
            }));
        });
    }, []);

    return (<TextContent>
        <Text component={ TextVariants.p }>
            <FormattedMessage
                id="wizard.ToGrantPermissionsToObtainSubscriptionDataCreateAnAwsIdentityAccessManagementIamPolicy"
                defaultMessage="To grant permissions to obtain subscription data, create an AWS identity access management (IAM) policy."
            />
        </Text>
        <TextList>
            <TextListItem>
                <FormattedMessage
                    id="wizard.SignInToThe"
                    defaultMessage="Sign in to the {link}."
                    values={{ link: <a
                        href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console.html"
                        rel="noopener noreferrer"
                        target="_blank">
                        <FormattedMessage id="wizard.AwsIdentityAccessManagementIamConsole" defaultMessage="AWS Identity Access Management* (IAM) console" />
                    </a>
                    }}
                />
            </TextListItem>
            <TextListItem>
                <FormattedMessage
                    id="wizard.CreateANewPolicyPastingTheFollowingContentIntoTheJsonTextBox"
                    defaultMessage="Create a new policy, pasting the following content into the JSON text box."
                />
            </TextListItem>
            <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-u-m-sm-on-sm" isReadOnly>
                {config ? JSON.stringify(config, null, 2) : intl.formatMessage({ id: 'wizard.loading', defaultMessage: 'Loading configuration...' })}
            </ClipboardCopy>
            <TextListItem>
                <FormattedMessage id="wizard.CompleteTheProcessToCreateYourNewPolicy" defaultMessage="Complete the process to create your new policy." />
            </TextListItem>
        </TextList>
        <Text component={ TextVariants.p }>
            <FormattedMessage
                id="wizard.BDoNotCloseYourBrowserBYouWillNeedToBeLoggedInToTheIamConsoleToComputeTheNextStep"
                defaultMessage="{bold} You will need to be logged in to the IAM console to compute the next step."
                values={{ bold: <b><FormattedMessage id="wizard.DoNotCloseYourBrowser" defaultMessage="Do not close your browser." /></b> }}
            />
        </Text>
    </TextContent>);};

export const ArnDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="wizard.ToEnableAccountAccessCaptureTheArnAssociatedWithTheRoleYouJustCreated"
            defaultMessage="To enable account access, capture the ARN associated with the role you just created."
        />
    </Text>
    <TextList>
        <TextListItem>
            <FormattedMessage
                id="wizard.FromTheRolesTabSelectTheRoleYouJustCreated"
                defaultMessage="From the Roles tab, select the role you just created."
            />
        </TextListItem>
        <TextListItem>
            <FormattedMessage
                id="wizard.FromTheSummaryScreenCopyTheRoleArnAndPasteItInTheArnField"
                defaultMessage="From the Summary screen, copy the role ARN and paste it in the ARN field:"
            />
        </TextListItem>
    </TextList>
</TextContent>);
