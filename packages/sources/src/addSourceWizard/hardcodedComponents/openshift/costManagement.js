import { TextContent, Text, TextVariants, TextListItem, TextList, Button, Popover, ButtonVariant } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { HCCM_DOCS_PREFIX } from '../../../utilities/stringConstants';

const INSTALL_PREREQUISITE = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/assembly_adding_sources_cost#installing_ocp_prerequisites`;

export const ConfigureCostOperator = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            The Cost Management Operator collects the data required for Cost Management.&nbsp;
            This is supported for clusters that are OpenShift Container Platform version 4.3 or later.&nbsp;
            <Text component={TextVariants.a} href={INSTALL_PREREQUISITE} target="_blank" rel="noopener noreferrer">Learn more</Text>
        </Text>
        <TextContent className='list-align-left'>
            <TextList component='ol'>
                <TextListItem component='li'>
                    Install the Cost Management Operator from OperatorHub on your cluster (search
                    for <i>cost management</i> ).
                </TextListItem>
                <TextListItem component='li'>
                    When configuration is complete provide your cluster identifier.<br />
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
            bodyContent={<Text>The cluster identifier can be found in the <b>Help &gt; About</b> screen on the cluster.</Text>}
        >
            <Button className='cluster-id-question-button' variant={ButtonVariant.plain}><QuestionCircleIcon /></Button>
        </Popover>
    </React.Fragment>
);

