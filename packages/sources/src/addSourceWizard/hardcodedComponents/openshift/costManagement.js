/* eslint-disable max-len */
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';
import { HCCM_DOCS_PREFIX } from '../../../utilities/stringConstants';

const INSTALL_PREREQUISITE = `${HCCM_DOCS_PREFIX}/html/getting_started_with_cost_management/index#assembly_koku_cost_management_installing`;

export const ConfigureCostOperator = () => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text>
                { intl.formatMessage({
                    id: 'cost.openshift.description',
                    defaultMessage: 'For Red Hat OpenShift Container Platform 4.5 and later, install the {operator} from the OpenShift Container Platform web console.'
                }, {
                    operator: <b key="bold">koku-metrics-operator</b>
                }) }
            </Text>
            <Text>
                <Text
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
            </Text>
            <Text>
                { intl.formatMessage({
                    id: 'cost.openshift.operator_configured',
                    defaultMessage: 'If you configured the operator to create a source (create_source: true), <b>STOP</b> here and <b>CANCEL</b> out of this flow.'
                }, {
                    // eslint-disable-next-line react/display-name
                    b: (chunks) => <b key={`b-${chunks.length}-${Math.floor(Math.random() * 1000)}`}>{chunks}</b>
                }) }
            </Text>
            <Text>
                { intl.formatMessage({
                    id: 'cost.openshift.operator_not_configured',
                    defaultMessage: 'Otherwise, enter the cluster identifier below. You can find the cluster identifier in the cluster’s Help > About screen.'
                }) }
            </Text>
        </TextContent>
    );
};
