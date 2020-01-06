import React from 'react';
import {
    ClipboardCopy,
    TextContent,
    Text,
    TextVariants,
    TextListItem,
    TextList,
    TextListVariants,
    TextListItemVariants
} from '@patternfly/react-core';

const AZURE_CREDS_URL = 'https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-certificate-credentials';
const RECURRING_TASK_URL = 'https://docs.microsoft.com/en-us/azure/logic-apps/concepts-schedule-automated-recurring-tasks-workflows';

export const ConfigureResourceGroupAndStorageAccount = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            Red Hat recommends creating a dedicated resource group and storage account in Azure to collect cost data and metrics for cost management.
        </Text>
        <Text component={TextVariants.p}>
            After configuring a resource group and storage account in the Azure portal, enter the following:
        </Text>
    </TextContent>
);

export const ServicePrincipalDescription = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            Red Hat recommends configuring dedicated credentials to grant cost management read-only access to Azure cost data.&nbsp;&nbsp;
            <Text rel="noopener noreferrer" target="_blank" component={TextVariants.a} href={AZURE_CREDS_URL}>Learn more</Text>
        </Text>
        <Text component={TextVariants.p}>
            Run the following command in Cloud Shell to obtain your Subscription ID and enter it further below
        </Text>
        <ClipboardCopy>{`az account show --query "{ subscription_id: id }"`}</ClipboardCopy>
    </TextContent>
);

export const CreateActiveDirectory = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            Run the following command in Cloud Shell to create an Active Directory application and assign it to a role using all
                default selections. From the output, enter the values in the fields below.
        </Text>
        <ClipboardCopy>{`az ad sp create-for-rbac --query '{"tenant": tenant, "client_id": appId, "secret": password}'`}</ClipboardCopy>
    </TextContent>
);

export const ExportSchedule = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            Create a recurring task to export cost data to your Azure storage account,
                where cost management will retrieve the data.&nbsp;&nbsp;
            <Text rel="noopener noreferrer" target="_blank" component={TextVariants.a} href={RECURRING_TASK_URL}>Learn more</Text>
        </Text>
        <TextContent className='list-align-left'>
            <TextList component={TextListVariants.ol}>
                <TextListItem component={TextListItemVariants.li}>
                    From the Azure portal, add a new export.
                </TextListItem>
                <TextListItem component={TextListItemVariants.li}>
                    Provide a name for the container and directory path, and
                        specify the below settings to create the daily export.
                            Leave all other options as the default.
                </TextListItem>
            </TextList>
        </TextContent>
        <TextList className='export-table' component={TextListVariants.dl}>
            <TextListItem component={TextListItemVariants.dt}>
                <Text component={TextVariants.b}>Export type</Text>
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
                Daily export for billing-period-to-date costs.
            </TextListItem>
            <TextListItem component={TextListItemVariants.dt}>
                <Text component={TextVariants.b}>Storage account name</Text>
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
                Storage account name created earlier.
            </TextListItem>
        </TextList>
    </TextContent>
);
