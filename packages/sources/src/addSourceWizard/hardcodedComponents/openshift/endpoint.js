import React from 'react';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { useIntl } from 'react-intl';

export const EndpointDesc = () => {
    const intl = useIntl();

    return (<TextContent>
        <Text component={ TextVariants.p }>
            { intl.formatMessage({
                id: 'openshift.endpoint.urlAndCA',
                defaultMessage: 'Provide the OpenShift Container Platform URL and SSL certificate.'
            }) }
        </Text>
    </TextContent>);
};
