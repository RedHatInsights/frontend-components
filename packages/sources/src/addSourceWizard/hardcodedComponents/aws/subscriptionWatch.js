import React from 'react';
import PropTypes from 'prop-types';
import {
    TextContent,
    Text,
    TextVariants,
    TextList,
    TextListItem,
    ClipboardCopy,
    ClipboardCopyVariant
} from '@patternfly/react-core';


export const IAMRoleDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
To delegate account access, create an IAM role to associate with your IAM policy.
    </Text>
    <TextList>
        <TextListItem>From the AWS Identity access management console, create a new role.</TextListItem>
        <TextListItem>Select another AWS account from the list of trusted entities and paste the following value into the Account ID field:</TextListItem>
        <ClipboardCopy className="pf-u-m-sm-on-sm" isReadOnly>
        372779871274
        </ClipboardCopy>
        <TextListItem>Attach the permissions policy that you just created.</TextListItem>
        <TextListItem>Complete the process to create your new role.</TextListItem>
    </TextList>
</TextContent>);

export const IAMPolicyDescription = ({ formOptions }) => {

    return (<TextContent>
        <Text component={ TextVariants.p }>
To grant permissions to obtain subscription data, create an AWS identity access management (IAM) policy.
        </Text>
        <TextList>
            <TextListItem>
                Sign in to the <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console.html" rel="noopener noreferrer" target="_blank">
                    AWS Identity Access Management* (IAM) console</a>.
            </TextListItem>
            <TextListItem>Create a new policy, pasting the following content into the JSON text box.</TextListItem>
            <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-u-m-sm-on-sm" isReadOnly>
                {JSON.stringify({
                    "Version": "2012-10-17",
                    "Statement": [{
                        "Sid": "VisualEditor0",
                        "Effect": "Allow",
                        "Action": [
                            "ec2:DescribeInstances",
                            "ec2:DescribeImages",
                            "ec2:DescribeSnapshots",
                            "ec2:ModifySnapshotAttribute",
                            "ec2:DescribeSnapshotAttribute",
                            "ec2:CopyImage",
                            "ec2:CreateTags",
                            "ec2:DescribeRegions",
                            "cloudtrail:CreateTrail",
                            "cloudtrail:UpdateTrail",
                            "cloudtrail:PutEventSelectors",
                            "cloudtrail:DescribeTrails",
                            "cloudtrail:StartLogging",
                            "cloudtrail:StopLogging"
                        ],
                        "Resource": "*"
                    }]
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


export const ArnDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
To enable account access, capture the ARN associated with the role you just created.
    </Text>
    <TextList>
        <TextListItem>From the Roles tab, select the role you just created.</TextListItem>
        <TextListItem>From the Summary screen, copy the role ARN and paste it in the ARN field:</TextListItem>
    </TextList>
</TextContent>);
