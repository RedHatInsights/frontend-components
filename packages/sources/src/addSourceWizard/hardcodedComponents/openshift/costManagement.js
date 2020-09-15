/* eslint-disable max-len */
import { TextContent, Text, TextVariants, TextListItem, TextList } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';
import { HCCM_DOCS_PREFIX } from '../../../utilities/stringConstants';

const INSTALL_PREREQUISITE = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/assembly_adding_sources_cost#installing_ocp_prerequisites`;

export const ConfigureCostOperator = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={TextVariants.p}>
                { intl.formatMessage({
                    id: 'cost.openshift.description',
                    defaultMessage: 'The Cost Management Operator collects the data required for Cost Management. This is supported for clusters that are OpenShift Container Platform version 4.3 or later. {more}'
                }, {
                    more: <Text
                        key="link"
                        component={TextVariants.a}
                        href={INSTALL_PREREQUISITE}
                        target="_blank"
                        rel="noopener noreferrer">
                        { intl.formatMessage({
                            id: 'wizard.learnMore',
                            defaultMessage: 'Learn more'
                        }) }
                    </Text>
                }) }
            </Text>
            <TextContent className='list-align-left'>
                <TextList component='ol'>
                    <TextListItem component='li'>
                        { intl.formatMessage({
                            id: 'cost.openshift.installOperator',
                            defaultMessage: 'Install the Cost Management Operator from OperatorHub on your cluster (search for {cost}).'
                        }, {
                            cost: <i key="italic">
                                { intl.formatMessage({
                                    id: 'cost.costManagement',
                                    defaultMessage: 'cost management'
                                }) }
                            </i>
                        }) }
                    </TextListItem>
                    <TextListItem component='li'>
                        { intl.formatMessage({
                            id: 'cost.openshift.aboutScreen',
                            defaultMessage: 'When configuration is complete, enter the cluster identifier below. The cluster identifier can be found in the cluster\'s Help > About screen.'
                        }) }
                    </TextListItem>
                </TextList>
            </TextContent>
        </TextContent>
    );
};
