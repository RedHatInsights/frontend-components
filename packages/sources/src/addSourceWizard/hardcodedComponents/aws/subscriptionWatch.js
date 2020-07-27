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
import { useIntl } from 'react-intl';

import { getSubWatchConfig } from '../../../api/subscriptionWatch';

export const IAMRoleDescription = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'subwatch.iamrole.delegateAccount',
                defaultMessage: 'To delegate account access, create an IAM role to associate with your IAM policy.'
            }) }
        </Text>
        <TextList>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.iamrole.createRole',
                    defaultMessage: 'From the AWS Identity access management console, create a new role.'
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.iamrole.pasteAccountID',
                    defaultMessage: 'Select another AWS account from the list of trusted entities and paste the following value into the Account ID field:'
                }) }
            </TextListItem>
            <ClipboardCopy className="pf-u-m-sm-on-sm" isReadOnly>
        372779871274
            </ClipboardCopy>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.iamrole.attachPolicy',
                    defaultMessage: 'Attach the permissions policy that you just created.'
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.iamrole.completeProcess',
                    defaultMessage: 'Complete the process to create your new role.'
                }) }
            </TextListItem>
        </TextList>
    </TextContent>);
};

export const IAMPolicyDescription = () =>  {
    const intl = useIntl();
    const [ config, setConfig ] = useState();

    useEffect(() => {
        getSubWatchConfig().then((conf) => setConfig(conf)).catch((e) => {
            console.error(e);
            setConfig(intl.formatMessage({
                id: 'subwatch.iampolicy.subWatchConfigError',
                defaultMessage: 'There is an error with loading of the configuration. Please go back and return to this step.'
            }));
        });
    }, []);

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'subwatch.iampolicy.grantPermissions',
                defaultMessage: 'To grant permissions to obtain subscription data, create an AWS identity access management (IAM) policy.'
            }) }
        </Text>
        <TextList>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.iampolicy.signIn',
                    defaultMessage: 'Sign in to the {link}.'
                }, {
                    link: <a
                        key='link'
                        href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console.html"
                        rel="noopener noreferrer"
                        target="_blank">
                        { intl.formatMessage({
                            id: 'subwatch.iampolicy.IAMconsole',
                            defaultMessage: 'AWS Identity Access Management* (IAM) console'
                        }) }
                    </a>
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.iampolicy.createPolicty',
                    defaultMessage: 'Create a new policy, pasting the following content into the JSON text box.'
                }) }
            </TextListItem>
            <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-u-m-sm-on-sm" isReadOnly>
                {config ? JSON.stringify(config, null, 2) : intl.formatMessage({ id: 'subwatch.iampolicy.loading', defaultMessage: 'Loading configuration...' })}
            </ClipboardCopy>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.iampolicy.completeProcess',
                    defaultMessage: 'Complete the process to create your new policy.'
                }) }
            </TextListItem>
        </TextList>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'subwatch.iampolicy.BDoNotCloseYourBrowserBYouWillNeedToBeLoggedInToTheIamConsoleToComputeTheNextStep',
                defaultMessage: '{bold} You will need to be logged in to the IAM console to compute the next step.'
            }, {
                bold: <b key="bold">
                    { intl.formatMessage({
                        id: 'subwatch.iampolicy.dontCloseBrowser',
                        defaultMessage: 'Do not close your browser.'
                    }) }
                </b>
            }) }
        </Text>
    </TextContent>);
};

export const ArnDescription = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'subwatch.arn.enableAccount',
                defaultMessage: 'To enable account access, capture the ARN associated with the role you just created.'
            }) }
        </Text>
        <TextList>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.arn.selectRole',
                    defaultMessage: 'From the Roles tab, select the role you just created.'
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'subwatch.arn.copyArn',
                    defaultMessage: 'From the Summary screen, copy the role ARN and paste it in the ARN field:'
                }) }
            </TextListItem>
        </TextList>
    </TextContent>);
};
