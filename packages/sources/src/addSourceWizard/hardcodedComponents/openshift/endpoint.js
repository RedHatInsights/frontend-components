import React from 'react';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

export const EndpointDesc = () => (<TextContent>
    <Text component={ TextVariants.p }>
        Provide the OpenShift Container Platform URL and SSL certificate.
    </Text>
</TextContent>);
