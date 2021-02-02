import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, TextContent, TextVariants, TextList, TextListVariants, TextListItem, ClipboardCopy, Hint, HintTitle, HintBody } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

import { getSourcesApi } from '../../../api';

const b = (chunks) => <b key={`b-${chunks.length}-${Math.floor(Math.random() * 1000)}`}>{chunks}</b>;

export const Project = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p} className="pf-u-mb-lg">
                { intl.formatMessage({
                    id: 'cost.gcp.projectDescription',
                    defaultMessage:
                    'Enter the ID of a project within your Google Cloud Platform (GCP) billing account. We’ll use this project to set up your BigQuery billing export.'
                }) }
            </Text>
            <Hint>
                <HintTitle>
                    {intl.formatMessage({
                        id: 'cost.gcp.project.hintTitle',
                        defaultMessage: 'GCP Recommendation'
                    })}
                </HintTitle>
                <HintBody>
                    {intl.formatMessage({
                        id: 'cost.gcp.project.hintDescription',
                        defaultMessage: 'Create a cloud project to contain all your billing administration needs.'
                    })}
                </HintBody>
            </Hint>
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
                    defaultMessage: 'To specify GCP access permissions for Red Hat, create an Identity and Access Management (IAM) role.'
                }) }
            </Text>
            <TextList component={TextListVariants.ol}>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.iam.firstStep',
                        defaultMessage: 'From the GCP console, navigate to <b>IAM & Admin > Roles.</b>'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.iam.firstStepB',
                        defaultMessage: 'Create a new role.'
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

export const Dataset = () => {
    const intl = useIntl();
    const { getState } = useFormApi();

    const projectId = getState().values.authentication?.username;

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
                        defaultMessage: 'In the BigQuery console, select your project (<b>{projectId}</b>) from the navigation menu.'
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
                        defaultMessage: 'In the <b>Dataset ID</b> field, enter a name for your dataset.'
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
    const [ googleAccount, setGoogleAccount ] = useState();

    useEffect(() => {
        const errorMessage = intl.formatMessage({
            id: 'cost.gcp.noAccount',
            defaultMessage: 'There is an error with loading of the account address. Please go back and return to this step.'
        });

        getSourcesApi().getGoogleAccount().then((data) => setGoogleAccount(data?.data?.[0]?.payload || errorMessage))
        .catch((e) => {
            console.error(e);
            setGoogleAccount(errorMessage);
        });
    }, []);

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
                        defaultMessage: 'In your IAM & Admin console, navigate to <b>IAM</b> and click <b>Add</b> to add a new member.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.secondStep',
                        defaultMessage: 'Paste the following value into the <b>New members</b> field:'
                    }, { b })}
                </TextListItem>
                <ClipboardCopy className="pf-u-m-sm  pf-u-ml-0" isReadOnly>
                    {googleAccount || intl.formatMessage({ id: 'cost.gcp.access.loading', defaultMessage: 'Loading account address...' })}
                </ClipboardCopy>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.access.thirdStep',
                        defaultMessage: 'Select the role you just created.'
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

export const BillingExport = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.gcp.billingExport.description',
                    defaultMessage: 'To enable detailed billing data exports to BigQuery, set up daily cost export.'
                }) }
            </Text>
            <TextList component={TextListVariants.ol}>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.billingExport.firstStep',
                        defaultMessage: 'In the Billing console, click <b>Billing export.</b>'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.billingExport.firstStepB',
                        defaultMessage: 'Click the <b>BigQuery export</b> tab.'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.billingExport.secondStep',
                        defaultMessage: 'In the <b>Daily cost detail</b> section, click <b>Edit settings.</b>'
                    }, { b })}
                </TextListItem>
                <TextListItem>
                    { intl.formatMessage({
                        id: 'cost.gcp.billingExport.thirdStep',
                        defaultMessage: 'Use the dropdown menus to select the correct project and dataset.'
                    })}
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
