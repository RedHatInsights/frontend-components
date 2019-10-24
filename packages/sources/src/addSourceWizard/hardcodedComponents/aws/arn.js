import React from 'react';
import PropTypes from 'prop-types';
import {
    TextContent,
    Text,
    TextVariants,
    TextList,
    TextListItem,
    TextListVariants,
    ClipboardCopy,
    ClipboardCopyVariant
} from '@patternfly/react-core';

export const UsageDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
To collect and store the information needed for cost management, you need to set up on Amazon S3 bucket for cost and usage reports.
    </Text>
    <TextList>
        <TextListItem>Specify or create an Amazon S3 Bucket for your account.</TextListItem>
        <TextListItem>
Create a cost and usage report using the following values:            <TextList>
                <TextListItem>Report name: koku.</TextListItem>
                <TextListItem>Time unit: hourly</TextListItem>
                <TextListItem>Include: Resource IDs</TextListItem>
                <TextListItem>Enable support for: RedShift, QuickSight</TextListItem>
                <TextListItem>Report path prefix: (leave blank)</TextListItem>
            </TextList>
        </TextListItem>
        <TextListItem>Enter the name of the Amazon S3 bucket you just created in the S3 bucket field:</TextListItem>
    </TextList>
</TextContent>);

export const IAMRoleDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
To delegate account access, create an IAM role to associate with your IAM policy.
    </Text>
    <TextList>
        <TextListItem>From the AWS Identity Access Management console, create a new role.</TextListItem>
        <TextListItem>Select another AWS Account from the list of trusted entities and paste the foolowing value into the Account ID field:</TextListItem>
        <ClipboardCopy className="pf-u-m-sm-on-sm" isReadOnly>
        589173575009
        </ClipboardCopy>
        <TextListItem>Attach the permissions policy that you just created.</TextListItem>
        <TextListItem>Complete the process to create your new role.</TextListItem>
    </TextList>
</TextContent>);

export const IAMPolicyDescription = ({ formOptions }) => {
    const s3Bucket = formOptions.getState().values.billing_source ? formOptions.getState().values.billing_source.bucket : undefined;

    if (!s3Bucket) {
        return 'Something went wrong, you are missing bucket value.';
    }

    return (<TextContent>
        <Text component={ TextVariants.p }>
To grant permissions to cost management report you just configured, create an AWS identity access management (IAM) policy.
        </Text>
        <TextList>
            <TextListItem>
                Sign in to the <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console.html" rel="noopener noreferrer" target="_blank">
                    AWS Identity Access Management* (IAM) console</a>.
            </TextListItem>
            <TextListItem>Create a new policy, pasting the following content into the JSON text box.</TextListItem>
            <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-u-m-sm-on-sm" isReadOnly>
                {JSON.stringify({
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Sid: 'VisualEditor0',
                            Effect: 'Allow',
                            Action: [
                                's3:Get*',
                                's3:List*'
                            ],
                            Resource: [
                                `arn:aws:s3:::${s3Bucket}`,
                                `arn:aws:s3:::${s3Bucket}/*`
                            ]
                        },
                        {
                            Sid: 'VisualEditor1',
                            Effect: 'Allow',
                            Action: [
                                's3:ListAllMyBuckets',
                                'iam:ListAccountAliases',
                                's3:HeadBucket',
                                'cur:DescribeReportDefinitions',
                                'organizations:List*',
                                'organizations:Describe*'
                            ],
                            Resource: '*'
                        }
                    ]
                }, null, 2)}
            </ClipboardCopy>
            <TextListItem>Complete the process to create your new policy.</TextListItem>
        </TextList>
        <Text component={ TextVariants.p }>
            <b>Do not close your browser.</b> You will need to be logged in to the IAM console to compute the next step.
        </Text>
    </TextContent>);
};

IAMPolicyDescription.propTypes = {
    formOptions: PropTypes.shape({
        getState: PropTypes.func.isRequired
    }).isRequired
};

export const TagsDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
If you are using tags in AWS to organize your resources, you can import those tags into the cost management application to help organize your costs.
    </Text>
    <TextList component={TextListVariants.ol}>
        <TextListItem>Go to biling section in AWS.</TextListItem>
        <TextListItem>{'On the "Cost allocation tags" page, click on the "activate" button.'}</TextListItem>
        <TextListItem>...</TextListItem>
    </TextList>
</TextContent>);

export const ArnDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
To enable account access, capture the ARN associated with the role you just created.
    </Text>
    <TextList>
        <TextListItem>From the Roles tab, select the role you just created.</TextListItem>
        <TextListItem>From the Summary screen, copy the role ARN and paste it in the ARN field:</TextListItem>
    </TextList>
</TextContent>);
