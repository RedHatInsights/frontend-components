import React from 'react';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import { Popover, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

const SSLFormLabel = () => (
    <React.Fragment>
        <FormattedMessage id="wizard.SslCertificate" defaultMessage="SSL Certificate" />&nbsp;
        <Popover
            aria-label="Help text"
            maxWidth="50%"
            bodyContent={
                <TextContent>
                    <Text component={ TextVariants.p }>
                        <FormattedMessage
                            id="wizard.YouCanObtainYourOpenshiftContainerPlatformProviderSCaCertificateForAllEndpointsDefaultMetricsAlertsFrom"
                            // eslint-disable-next-line max-len
                            defaultMessage="You can obtain your OpenShift Container Platform provider’s CA certificate for all endpoints (default, metrics, alerts) from {cmd}."
                            values={{ cmd: <b>/etc/origin/master/ca.crt</b> }}
                        />
                    </Text>
                    <Text component={ TextVariants.p }>
                        <FormattedMessage
                            id="wizard.PasteTheOutputABlockOfTextStartingWithBeginCertificateIntoTheTrustedCaCertificatesField"
                            defaultMessage="Paste the output (a block of text starting with --BEGIN CERTIFICATE--) into the Trusted CA Certificates field."
                        />
                    </Text>
                </TextContent>
            }
        >
            <QuestionCircleIcon />
        </Popover>
    </React.Fragment>
);

export default SSLFormLabel;
