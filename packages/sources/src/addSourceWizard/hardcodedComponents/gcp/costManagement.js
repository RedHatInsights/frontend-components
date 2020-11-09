import React from 'react';
import { useIntl } from 'react-intl';
import { Text, TextContent, TextVariants, TextList, TextListVariants, TextListItem, ClipboardCopy, Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const b = (chunks) => <b key={`b-${chunks.length}-${Math.floor(Math.random() * 1000)}`}>{chunks}</b>;

export const Project = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.gcp.projectDescription',
                    defaultMessage: 'To collect the information needed for Cost Management, you must specify a project within your GCP billing account.'
                }) }
            </Text>
        </TextContent>
    );
};

export const IAMRole = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.gcp.iamRoleDescription',
                    defaultMessage: 'To specify the permissions you will assign, create an Identity and Access Management (IAM) role.'
                }) }
            </Text>
            <TextList component={TextListVariants.ol}>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.iam.firstStep',
                        defaultMessage: 'From the GCP console, navigate to IAM & Admin > Roles and <b>create a new role.</b>'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    {intl.formatMessage({ id: 'cost.gcp.iam.secondStep', defaultMessage: 'Add the following permissions to your custom role:' })}
                </TextListItem>
                <TextList>
                    <TextListItem><b>bigquery.jobs.create</b></TextListItem>
                    <TextListItem><b>bigquery.tables.getData</b></TextListItem>
                    <TextListItem><b>bigquery.tables.get</b></TextListItem>
                    <TextListItem><b>bigquery.tables.list</b></TextListItem>
                </TextList>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.iam.thirdStep',
                        defaultMessage: 'Click <b>Create role.</b>'
                    }, { b })}
                </TextListItem>
            </TextList>
        </TextContent>
    );
};

export const AssignAccess = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.gcp.assignAccessDesc',
                    defaultMessage: 'To delegate account access, add a new member to your project.'
                }) }
            </Text>
            <TextList component={TextListVariants.ol}>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.firstStep',
                        defaultMessage: 'From the IAM & Admin console, navigate to IAM and click <b>Add</b> to add a new member.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.secondStep',
                        defaultMessage: 'Paste the following value into the <b>New members</b> field:'
                    }, { b })}
                </TextListItem>
                <ClipboardCopy className="pf-u-m-sm  pf-u-ml-0" isReadOnly>
                    billing-export@red-hat-cost-management.iam.gserviceaccount.com
                </ClipboardCopy>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.thirdStep',
                        defaultMessage: 'Select the role that you just created.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.fourthStep',
                        defaultMessage: 'Click <b>Save.</b>'
                    }, { b })}
                </TextListItem>
            </TextList>
        </TextContent>
    );
};

export const Dataset = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.gcp.dataset.description',
                    defaultMessage: 'To collect and store the information needed for Cost Management, create a BigQuery dataset.'
                }) }
            </Text>
            <TextList component={TextListVariants.ol}>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.dataset.firstStep',
                        defaultMessage: 'From the <b>BigQuery</b> console, select your <b>project</b> from the left panel.'
                    }, { b })}
                    <Tooltip
                        position="right"
                        content={
                            <Text component={ TextVariants.p }>
                                { intl.formatMessage({
                                    id: 'cost.gcp.dataset.popover_text',
                                    defaultMessage: 'You can find the BigQuery console under the Big Data section of the left navigation in GCP'
                                }) }
                            </Text>
                        }
                    >
                        <OutlinedQuestionCircleIcon className="pf-u-ml-sm"/>
                    </Tooltip>
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.dataset.secondStep',
                        defaultMessage: 'Click <b>Create dataset.</b>'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.dataset.thirdStep',
                        defaultMessage: 'Enter a name for your dataset in the <b>Dataset ID</b> field.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.dataset.fourthStep',
                        defaultMessage: 'Click <b>Create dataset.</b>'
                    }, { b })}
                </TextListItem>
            </TextList>
        </TextContent>
    );
};

export const BillingExport = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.gcp.billingExport.description',
                    defaultMessage: 'To enable the export of detailed billing data to BigQuery, set up daily cost export.'
                }) }
            </Text>
            <TextList component={TextListVariants.ol}>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.billingExport.firstStep',
                        defaultMessage: 'From the <b>Billing</b> console, navigate to <b>Billing export</b>. Make sure you remain in the <b>BigQuery export</b> tab.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.billingExport.secondStep',
                        defaultMessage: 'Under the section titled <b>Daily cost detail</b>, click <b>Edit settings.</b>'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.billingExport.thirdStep',
                        defaultMessage: 'Select the correct <b>project</b> and <b>dataset</b> from the respective dropdown menus.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.billingExport.fourthStep',
                        defaultMessage: 'Click <b>Save.</b>'
                    }, { b })}
                </TextListItem>
            </TextList>
        </TextContent>
    );
};
