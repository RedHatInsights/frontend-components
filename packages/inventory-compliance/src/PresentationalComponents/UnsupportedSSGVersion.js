import React from 'react';
import propTypes from 'prop-types';
import { Popover, Alert } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

export const supportedConfigsLink = 'https://access.redhat.com/documentation/en-us/red_hat_insights/2020-10/' +
    'html/assessing_and_monitoring_security_policy_compliance_of_rhel_systems/' +
    'con-compl-assess-overview_compl-assess-overview#con-compl-assess-supported-configurations_compl-assess-overview';

const UnsupportedSSGVersion = ({ ssgVersion, style }) => {
    const bodyContent = 'This system was using an incompatible version of the SSG at the time this report was generated.' +
        ' Assessment of rules failed/passed on this system is a best-guess effort and may not be accurate.';
    const footerContent = <a target='_blank' rel='noopener noreferrer' href={ supportedConfigsLink }>Supported SSG versions</a>;

    return <Alert
        variant="warning"
        isInline
        style={ style }
        title={
            <React.Fragment>
                Unsupported SSG version ({ ssgVersion })
                <Popover position='right' { ...{ bodyContent, footerContent } }>
                    <OutlinedQuestionCircleIcon
                        style={ { marginLeft: '.5em', cursor: 'pointer', color: 'var(--pf-global--Color--200)' } } />
                </Popover>
            </React.Fragment>
        } />;
};

UnsupportedSSGVersion.propTypes = {
    ssgVersion: propTypes.string,
    style: propTypes.object
};

export default UnsupportedSSGVersion;
