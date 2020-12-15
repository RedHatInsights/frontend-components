import React from 'react';
import { useIntl } from 'react-intl';
import { Text, TextContent, TextVariants, TextList, TextListVariants, TextListItem, ClipboardCopy } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

const b = (chunks) => <b key={`b-${chunks.length}-${Math.floor(Math.random() * 1000)}`}>{chunks}</b>;

export const Project = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.gcp.projectDescription',
                    defaultMessage: 'Identify a project within your GCP billing account. This will be the project used to set up your billing export dataset.'
                }) }
            </Text>
        </TextContent>
    );
};

export const Dataset = () => {
    const intl = useIntl();
    const { getState } = useFormApi();

    const projectId = getState().values.authentication?.password;

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
                        defaultMessage: 'From the GCP <b>BigQuery</b> console, select your project <b>({projectId})</b>.'
                    }, { b, projectId })}
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

export const AssignAccess = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.gcp.assignAccessDesc',
                    defaultMessage: 'To delegate account access, add a new member to your dataset.'
                }) }
            </Text>
            <TextList component={TextListVariants.ol}>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.firstStep',
                        defaultMessage: 'From your dataset, click on the button labeled <b>Share Dataset</b>.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.secondStep',
                        defaultMessage: 'Paste the following value into the <b>Add members</b> field:'
                    }, { b })}
                </TextListItem>
                <ClipboardCopy className="pf-u-m-sm  pf-u-ml-0" isReadOnly>
                    billing-export@red-hat-cost-management.iam.gserviceaccount.com
                </ClipboardCopy>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.thirdStep',
                        defaultMessage: 'Select <b>BigQuery User</b> from the role dropdown menu.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.fourthStep',
                        defaultMessage: 'Click <b>Add</b> to finish assigning permissions.'
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
