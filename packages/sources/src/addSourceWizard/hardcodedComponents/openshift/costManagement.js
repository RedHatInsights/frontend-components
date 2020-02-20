import { TextContent, Text, TextVariants, TextListItem, TextList, Button, ClipboardCopy, Popover, ButtonVariant } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';

const OPENSHIFT_INSTALLATION_URL = 'https://docs.openshift.com/container-platform/4.2/getting_started/install_openshift.html';
const OPERATOR_METERING_INSTALLATION_URL = 'https://docs.openshift.com/container-platform/4.2/metering/metering-installing-metering.html';
const ANSIBLE_INSTALLATION_URL = 'https://access.redhat.com/articles/3174981';
const EPEL_INSTALLATION_URL = 'https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#basics-what-will-be-installed';
const OC_CMD_URL = 'https://docs.openshift.com/container-platform/4.2/cli_reference/openshift_cli/getting-started-cli.html#cli-installing-cli_cli-developer-commands';
const USAGE_COLLECTOR_URL = 'https://github.com/project-koku/korekuta/archive/master.zip';
const OPERATOR_METERING_URL = 'https://github.com/operator-framework/operator-metering/blob/master/Documentation/metering-config.md';
const REPORTING_OPERATOR_URL = 'https://docs.openshift.com/container-platform/4.2/metering/configuring-metering/metering-configure-reporting-operator.html';

export const PrerequisiteDescription = () => (
    <TextContent key='description'>
        <Text component={TextVariants.p}>
            Before you begin, install the following prerequisites if not present:
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
                <Text
                    component={TextVariants.a}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={OPENSHIFT_INSTALLATION_URL}
                >
                    OpenShift Container Platform 4.2 or newer
                </Text>
            </TextListItem>
            <TextListItem component='li'>
                <Text
                    component={TextVariants.a}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={OPERATOR_METERING_INSTALLATION_URL}
                >
                        Operator Metering
                </Text>
            </TextListItem>
        </TextList>
    </TextContent>
);

export const PrerequisiteSystemList = () => (
    <TextContent className='list-align-top'>
        <TextList component='ul'>
            <TextListItem component='li'>
                <Text
                    component={TextVariants.a}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="htps://access.redhat.com/products/red-hat-insights#getstarted"
                >
                    Red Hat Insights Client
                </Text>
            </TextListItem>
            <TextListItem component='li'>
                <Text
                    component={TextVariants.a}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={ANSIBLE_INSTALLATION_URL}
                >
                    Ansible
                </Text>
                &nbsp;and the&nbsp;
                <Text
                    component={TextVariants.a}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={EPEL_INSTALLATION_URL}
                >
                    EPEL repository
                </Text>
            </TextListItem>
            <TextListItem component='li'>
                <Text
                    component={TextVariants.a}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={OC_CMD_URL}
                >
                    OpenShift command line tools (oc)
                </Text>
            </TextListItem>
        </TextList>
    </TextContent>
);

export const ObtainLoginDescription = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            To gather OpenShift Container Platform metering data, Cost Management requires the login token for the Reporting Operator service account.
            <Popover
                aria-label="more-information-popover"
                position="top"
                bodyContent={
                    <TextContent>
                        When you install Operator Metering for Red Hat OpenShift Container Platform, the&nbsp;
                        <i>reporting-operator</i> service account is created in the Reporting Operator namespace.&nbsp;
                        <a href={REPORTING_OPERATOR_URL} target="_blank" rel="noopener noreferrer">Learn more</a>
                    </TextContent>
                }
            >
                <Button variant={ButtonVariant.plain}><QuestionCircleIcon /></Button>
            </Popover>
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
            The Usage Collector connects to your cluster and collects the data required for Cost Management.
        </Text>
        <TextContent className='list-align-left'>
            <TextList component='ol'>
                <TextListItem component='li'>
                    Download and install the&nbsp;
                    <a href={USAGE_COLLECTOR_URL} target="_blank" rel="noopener noreferrer">OpenShift Usage Collector</a>
                    &nbsp;on the same system where the Red Hat Insights client is installed.
                </TextListItem>
                <TextListItem component='li'>
                    Navigate to the <b>korekuta-master</b> directory to find the <i>ocp_usage.sh</i> script.
                </TextListItem>
                <TextListItem component='li'>
                    <Text component={TextVariants.p}>
                        Run the <i>ocp_usage.sh</i> script to configure the Usage Collector.<br />
                        Use the following example, substituting values for your OpenShift API endpoint,&nbsp;
                        Reporting Operator namespace, and <i>reporting-operator</i> token file path:
                    </Text>
                    <Text component={TextVariants.p}>
                        {`# ./ocp_usage.sh --setup -e OCP_API="https://api.openshift-prod.mycompany.com"
                        -e OCP_METERING_NAMESPACE="metering" -e OCP_TOKEN_PATH="/path/to/ocp_usage_token"
                        -e METERING_API="https://metering.metering.api.ocp.com"`}
                        <Popover
                            aria-label="more-information-popover"
                            position="top"
                            bodyContent={
                                <TextContent>
                                    If the oc command line is installed in a different location from&nbsp;
                                    /usr/bin/oc on your system, specify the path using -e OCP_CLI={'</path/to/oc>'}&nbsp;
                                    when executing the ocp_usage.sh command.
                                </TextContent>
                            }
                        >
                            <Button variant={ButtonVariant.plain}><QuestionCircleIcon /></Button>
                        </Popover>
                    </Text>
                </TextListItem>
                <TextListItem component='li'>
                    When configuration is complete, you will receive a confirmation message that contains a cluster identifier.<br />
                    Enter that value in the cluster identifier field.
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
            Create a cron job to regularly upload data collected by the Usage Collector to Cost Management.
        </Text>
        <TextContent className='list-align-left'>
            <TextList component='ol'>
                <TextListItem component='li'>
                    Open the crontab for the user that will execute this scheduled upload:
                    <Popover
                        aria-label="more-information-popover"
                        position="top"
                        bodyContent={
                            <TextContent>
                                When you install Operator Metering for Red Hat OpenShift Container Platform,&nbsp;
                                the <i>reporting-operator</i> service account is created in the Reporting Operator namespace.&nbsp;
                                <a target="_blank" rel="noopener noreferrer" href={OPERATOR_METERING_URL}>Learn more</a>
                            </TextContent>
                        }
                    >
                        <Button variant={ButtonVariant.plain}><QuestionCircleIcon /></Button>
                    </Popover>
                    <ClipboardCopy textAriaLabel="command line">{'crontab -u <USERNAME> -e'}</ClipboardCopy>
                </TextListItem>
                <TextListItem component='li'>
                    Create a crontab entry to run the Usage Collector every 45 minutes:
                    <ClipboardCopy textAriaLabel="command line">*/45 * * * * /path/to/ocp_usage.sh --collect</ClipboardCopy>
                </TextListItem>
                <TextListItem component='li'>
                    Click Next to finish adding the OpenShift cluster as a source.
                </TextListItem>
            </TextList>
        </TextContent>
    </TextContent>
);
