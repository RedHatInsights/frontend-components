/* eslint-disable max-len */
import { TextContent, Text, TextVariants, TextListItem, TextList } from '@patternfly/react-core';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { HCCM_DOCS_PREFIX } from '../../../utilities/stringConstants';

const INSTALL_PREREQUISITE = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/assembly_adding_sources_cost#installing_ocp_prerequisites`;

export const ConfigureCostOperator = () => (
    <TextContent>
        <Text component={TextVariants.p}>
            <FormattedMessage
                id="wizard.TheCostManagementOperatorCollectsTheDataRequiredForCostManagementThisIsSupportedForClustersThatAreOpenshiftContainerPlatformVersionOrLaterMore"
                defaultMessage="The Cost Management Operator collects the data required for Cost Management. This is supported for clusters that are OpenShift Container Platform version 4.3 or later. {more}"
                values={{ more: <Text
                    component={TextVariants.a}
                    href={INSTALL_PREREQUISITE}
                    target="_blank"
                    rel="noopener noreferrer"><FormattedMessage id="wizard.LearnMore" defaultMessage="Learn more" /></Text>
                }}
            />
        </Text>
        <TextContent className='list-align-left'>
            <TextList component='ol'>
                <TextListItem component='li'>
                    <FormattedMessage
                        id="wizard.InstallTheCostManagementOperatorFromOperatorhubOnYourClusterSearchForICostManagementI"
                        defaultMessage="Install the Cost Management Operator from OperatorHub on your cluster (search for {cost})."
                        values={{ cost: <i><FormattedMessage id="wizard.CostManagement" defaultMessage="cost management" /></i> }}
                    />
                </TextListItem>
                <TextListItem component='li'>
                    <FormattedMessage
                        id="wizard.WhenConfigurationIsCompleteEnterTheClusterIdentifierBelowTheClusterIdentifierCanBeFoundInTheClusterAposSHelpGtAboutScreen"
                        defaultMessage="When configuration is complete, enter the cluster identifier below. The cluster identifier can be found in the cluster's Help > About screen."
                    />
                </TextListItem>
            </TextList>
        </TextContent>
    </TextContent>
);
