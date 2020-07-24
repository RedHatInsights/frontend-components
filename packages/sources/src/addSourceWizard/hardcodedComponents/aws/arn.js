/* eslint-disable max-len */
import React from 'react';
import {
    TextContent,
    Text,
    TextVariants,
    TextList,
    TextListItem,
    TextListItemVariants,
    TextListVariants,
    ClipboardCopy,
    ClipboardCopyVariant
} from '@patternfly/react-core';
import { HCCM_DOCS_PREFIX } from '../../../utilities/stringConstants';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import { useIntl } from 'react-intl';

const CREATE_S3_BUCKET = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/assembly_adding_sources_cost#creating_an_aws_s3_bucket`;
const ENABLE_AWS_ACCOUNT = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/assembly_adding_sources_cost#enabling_aws_account_access`;

export const UsageDescription = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'cost.usageDescription.usageDescription',
                defaultMessage: 'To collect and store the information needed for cost management, you need to set up an Amazon S3 bucket for cost and usage reports. {link}'
            },
            { link: (<Text key="link" component={TextVariants.a} href={CREATE_S3_BUCKET} rel="noopener noreferrer" target="_blank">
                { intl.formatMessage({
                    id: 'cost.learnMore',
                    defaultMessage: 'Learn more'
                }) }
            </Text>)
            }) }
        </Text>
        <TextList component={TextListVariants.ol}>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.usageDescription.specifyBucker',
                    defaultMessage: 'Specify or create an Amazon S3 bucket for your account.'
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.usageDescription.addFollowingValues',
                    defaultMessage: 'Create a cost and usage report using the following values:'
                }) }
                <TextList>
                    <TextListItem>
                        { intl.formatMessage({
                            id: 'cost.usageDescription.repornName',
                            defaultMessage: 'Report name: koku'
                        }) }
                    </TextListItem>
                    <TextListItem>
                        { intl.formatMessage({
                            id: 'cost.usageDescription.timeUnitHoulry',
                            defaultMessage: 'Time unit: hourly'
                        }) }
                    </TextListItem>
                    <TextListItem>
                        { intl.formatMessage({
                            id: 'cost.usageDescription.includesResourceIDs',
                            defaultMessage: 'Include: Resource IDs'
                        }) }
                    </TextListItem>
                    <TextListItem>
                        { intl.formatMessage({
                            id: 'cost.usageDescription.enableSuppor',
                            defaultMessage: 'Enable support for: RedShift, QuickSight and disable support for Athena'
                        }) }
                    </TextListItem>
                    <TextListItem>
                        { intl.formatMessage({
                            id: 'cost.usageDescription.reportPathPrefix',
                            defaultMessage: 'Report path prefix: (leave blank)'
                        }) }
                    </TextListItem>
                    <TextListItem>
                        { intl.formatMessage({
                            id: 'cost.usageDescription.compression',
                            defaultMessage: 'Compression type: GZIP'
                        }) }
                    </TextListItem>
                </TextList>
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.usageDescription.enterNameOfCreatedBucker',
                    defaultMessage: 'Enter the name of the Amazon S3 bucket you just created below:'
                }) }
            </TextListItem>
        </TextList>
    </TextContent>);
};

export const IAMRoleDescription = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'cost.iamrole.createIamRole',
                defaultMessage: 'To delegate account access, create an IAM role to associate with your IAM policy.'
            }) }
        </Text>
        <TextList>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.iamrole.createNewRole',
                    defaultMessage: 'From the AWS Identity access management console, create a new role.'
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.iamrole.enterAccountId',
                    defaultMessage: 'Select another AWS account from the list of trusted entities and paste the following value into the Account ID field:'
                }) }
            </TextListItem>
            <ClipboardCopy className="pf-u-m-sm-on-sm" isReadOnly>
        589173575009
            </ClipboardCopy>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.iamrole.attachPolicy',
                    defaultMessage: 'Attach the permissions policy that you just created.'
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.iamrole.completeProccess',
                    defaultMessage: 'Complete the process to create your new role.'
                }) }
            </TextListItem>
        </TextList>
    </TextContent>);
};

export const IAMPolicyDescription = () => {
    const formOptions = useFormApi();
    const intl = useIntl();

    const s3Bucket = formOptions.getState().values.billing_source ? formOptions.getState().values.billing_source.bucket : undefined;

    if (!s3Bucket) {
        return (<Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'cost.iampolicy.somethingWrong',
                defaultMessage: 'Something went wrong, you are missing bucket value.'
            }) }
        </Text>);
    }

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'cost.iampolicy.grantPermissions',
                defaultMessage: 'To grant permissions to the cost management report you just configured, create an AWS Identity and Access Management (IAM) policy. {link}'
            }, {
                link: <Text key="link" component={TextVariants.a} href={ENABLE_AWS_ACCOUNT} rel="noopener noreferrer" target="_blank">
                    { intl.formatMessage({
                        id: 'wizard.learnMore',
                        defaultMessage: 'Learn more'
                    }) }
                </Text>
            }) }
        </Text>
        <TextList component={TextListVariants.ol}>
            <TextListItem component={TextListItemVariants.li}>
                { intl.formatMessage({
                    id: 'cost.iampolicy.signInIAMConsole',
                    defaultMessage: 'Sign in to the AWS Identity and Access Management (IAM) console.'
                }) }
            </TextListItem>
            <TextListItem component={TextListItemVariants.li}>
                { intl.formatMessage({
                    id: 'cost.iampolicy.createPolicy',
                    defaultMessage: 'Create a new policy, pasting the following content into the JSON text box.'
                }) }
            </TextListItem>
            <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-u-m-sm-on-sm" isReadOnly>
                {JSON.stringify({
                    Version: '2012-10-17',
                    Statement: [{
                        Sid: 'VisualEditor0',
                        Effect: 'Allow',
                        Action: [ 's3:Get*', 's3:List*' ],
                        Resource: [
                            `arn:aws:s3:::${s3Bucket}`,
                            `arn:aws:s3:::${s3Bucket}/*`
                        ] }, {
                        Sid: 'VisualEditor1',
                        Effect: 'Allow',
                        Action: [ 's3:HeadBucket', 'cur:DescribeReportDefinitions' ],
                        Resource: '*'
                    }]
                }, null, 2)}
            </ClipboardCopy>
            <TextListItem component={TextListItemVariants.li}>
                { intl.formatMessage({
                    id: 'cost.iampolicy.completeProccess',
                    defaultMessage: 'Complete the process to create your new policy.'
                }) }
            </TextListItem>
        </TextList>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'cost.iampolicy.logInIam',
                defaultMessage: '{bold} You will need to be logged in to the IAM console to complete the next step.'
            }, {
                bold: <b key="bold">
                    { intl.formatMessage({
                        id: 'cost.DoNotCloseYourBrowser',
                        defaultMessage: 'Do not close your browser.'
                    }) }
                </b>
            }) }
        </Text>
    </TextContent>);
};

export const TagsDescription = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'cost.tags.desciption',
                defaultMessage: 'To use tags to organize your AWS resources in the cost management application, activate your tags in AWS to allow them to be imported automatically.'
            }) }
        </Text>
        <TextList component={TextListVariants.ol}>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.tags.openSection',
                    defaultMessage: 'In the AWS Billing and Cost Management console, open the Cost Allocation Tags section.'
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.tags.selectTags',
                    defaultMessage: 'Select the tags you want to use in the cost management application, and click Activate.'
                }) }
            </TextListItem>
        </TextList>
    </TextContent>);
};

export const ArnDescription = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'cost.arn.enableAccess',
                defaultMessage: 'To enable account access, capture the ARN associated with the role you just created.'
            }) }
        </Text>
        <TextList>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.arn.selectRole',
                    defaultMessage: 'From the Roles tab, select the role you just created.'
                }) }
            </TextListItem>
            <TextListItem>
                { intl.formatMessage({
                    id: 'cost.arn.copyArn',
                    defaultMessage: 'From the Summary screen, copy the role ARN and paste it in the ARN field:'
                }) }
            </TextListItem>
        </TextList>
    </TextContent>);
};
