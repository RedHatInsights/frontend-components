import { TextContent, Text, TextVariants, TextListItem, TextList, Button, ClipboardCopy, Popover, ButtonVariant } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { HCCM_DOCS_PREFIX } from '../../../utilities/stringConstants';

const USAGE_COLLECTOR_URL = 'https://github.com/project-koku/korekuta/archive/master.zip';
const INSTALL_PREREQUISITE = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/assembly_adding_sources_cost#installing_ocp_prerequisites`;
const REPORTING_OPERATOR_URL = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/assembly_adding_sources_cost#obtaining_metering_operator_login_ocp`;
const UPLOAD_DATA_USAGE_COLLECTOR = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/assembly_adding_sources_cost#uploading_data_with_usage_collector_ocp`;

export const PrerequisiteDescription = () => (
    <TextContent key='description'>
        <Text component={TextVariants.p}>
            Before you begin, install the following prerequisites if not present.&nbsp;
            <Text component={TextVariants.a} target="_blank" rel="noopener noreferrer" href={INSTALL_PREREQUISITE}>
                Learn more
            </Text>
        </Text>
    </TextContent>
);

export const PrerequisiteOCPText = () => (
    <TextContent key='prerequisite-ocp'>
        <Text component={TextVariants.p}>
            On your OpenShift cluster, install:
        </Text>
    </TextContent>
);

export const PrerequisiteSystemText = () => (
    <TextContent key='prerequisite-system'>
        <Text component={TextVariants.p}>
            On a system with network access to your OpenShift cluster, install:
        </Text>
    </TextContent>
);

export const PrerequisiteOCPList = () => (
    <TextContent className='list-align-top'>
        <TextList component='ul'>
            <TextListItem component='li'>
                    OpenShift Container Platform 4.3 or newer
            </TextListItem>
            <TextListItem component='li'>
                        Operator Metering
            </TextListItem>
        </TextList>
    </TextContent>
);

export const PrerequisiteSystemList = () => (
    <TextContent className='list-align-top'>
        <TextList component='ul'>
            <TextListItem component='li'>
                    Red Hat Insights Client
            </TextListItem>
            <TextListItem component='li'>
                    Ansible and the EPEL repository
            </TextListItem>
            <TextListItem component='li'>
                    OpenShift command line tools (oc)
            </TextListItem>
        </TextList>
    </TextContent>
);

export const ObtainLoginDescription = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            To gather OpenShift Container Platform metering data, cost management requires the login token for the Reporting Operator service account.&nbsp;
            <Text component={TextVariants.a} target="_blank" rel="noopener noreferrer" href={REPORTING_OPERATOR_URL}>Learn more</Text>
        </Text>
        <TextContent className='list-align-left'>
            <TextList component='ol'>
                <TextListItem component='li'>
                    Log in to the Red Hat OpenShift Container Platform cluster with an account
                        that has access to the Reporting Operator namespace.
                </TextListItem>
                <TextListItem component='li'>
                    To obtain your login token, run:
                    <ClipboardCopy textAriaLabel="command line">{`oc serviceaccounts get-token reporting-operator > ocp_usage_token`}</ClipboardCopy>
                </TextListItem>
                <TextListItem component='li'>
                    To maintain security, store the token file on a file system with limited access.
                </TextListItem>
            </TextList>
        </TextContent>
    </TextContent>
);

export const ConfigureUsageCollector = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            The Usage Collector connects to your cluster and collects the data required for cost management.&nbsp;
            <Text component={TextVariants.a} href={UPLOAD_DATA_USAGE_COLLECTOR} target="_blank" rel="noopener noreferrer">Learn more</Text>
        </Text>
        <TextContent className='list-align-left'>
            <TextList component='ol'>
                <TextListItem component='li'>
                    Download and install the&nbsp;
                    <Text component={TextVariants.a} href={USAGE_COLLECTOR_URL} target="_blank" rel="noopener noreferrer">OpenShift Usage Collector</Text>
                    &nbsp;on the same system where the Red Hat Insights client is installed.
                </TextListItem>
                <TextListItem component='li'>
                    Navigate to the <b>korekuta-master</b> directory to find the <i>ocp_usage.sh</i> script.
                </TextListItem>
                <TextListItem component='li'>
                    <Text component={TextVariants.p}>
                        Run the <i>ocp_usage.sh</i> script to configure the Usage Collector with the values for
                        your OpenShift API endpoint, Reporting Operator namespace, and <i>reporting-operator</i> token
                        file path.
                    </Text>
                </TextListItem>
                <TextListItem component='li'>
                    When configuration is complete, the confirmation will provide your cluster identifier.<br />
                    Enter the cluster identifier below:
                </TextListItem>
            </TextList>
        </TextContent>
    </TextContent>
);

export const ClusterIdentifierLabel = () => (
    // Github issue: https://github.com/patternfly/patternfly-react/issues/3731
    <React.Fragment>
        Cluster identifier <span className="pf-c-form__label-required" aria-hidden="true">*</span>
        <Popover
            aria-label="more-information-popover"
            position="top"
            bodyContent={<Text>The cluster identifier value is stored in <b>~/.config/ocp_usage/config.json</b></Text>}
        >
            <Button className='cluster-id-question-button' variant={ButtonVariant.plain}><QuestionCircleIcon /></Button>
        </Popover>
    </React.Fragment>
);

export const DataCollectionDescription = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            Create a cron job to regularly upload data collected by the Usage Collector to cost management.&nbsp;
            <Text href={UPLOAD_DATA_USAGE_COLLECTOR} component={TextVariants.a} target="_blank" rel="noopener noreferrer">Learn more</Text>
        </Text>
        <TextContent className='list-align-left'>
            <TextList component='ol'>
                <TextListItem component='li'>
                    Open the crontab for the user that will execute this scheduled upload:
                    <ClipboardCopy textAriaLabel="command line">{'crontab -u <USERNAME> -e'}</ClipboardCopy>
                </TextListItem>
                <TextListItem component='li'>
                    Create a crontab entry to run the Usage Collector every 45 minutes:
                    <ClipboardCopy textAriaLabel="command line">*/45 * * * * /path/to/ocp_usage.sh --collect</ClipboardCopy>
                </TextListItem>
            </TextList>
        </TextContent>
    </TextContent>
);
