import React from 'react';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

export const EndpointDesc = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="wizard.ProvideTheOpenshiftContainerPlatformUrlAndSslCertificate"
            defaultMessage="Provide the OpenShift Container Platform URL and SSL certificate."
        />
    </Text>
</TextContent>);
