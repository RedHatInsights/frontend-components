import React from 'react';
import propTypes from 'prop-types';
import { Popover, Text } from '@patternfly/react-core';
import { ExclamationTriangleIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const UnsupportedSSGVersion = ({ ssgVersion }) => {
    const bodyContent = 'This system is running an unsupported version of the SCAP Security Guide (SSG).' +
        'This information is based on the last report uploaded for this system to the Compliance service.';
    const supportedConfigsLink = 'https://access.redhat.com/documentation/en-us/red_hat_insights/2020-10/' +
        'html/assessing_and_monitoring_security_policy_compliance_of_rhel_systems/' +
        'compl-assess-overview-con#compl-assess-supported-configurations-con';
    const footerContent = <a target='_blank' rel='noopener noreferrer' href={ supportedConfigsLink }>Supported SSG versions</a>;
    const divStyle = {
        display: 'block',
        margin: '1rem -1.5rem -1.5rem -1.5rem',
        padding: '1rem 1.5rem'
    };

    return <div className='pf-c-alert pf-m-warning pf-m-inline' style={ divStyle }>
        <ExclamationTriangleIcon className='ins-u-warning' style={ { marginRight: '.25em' } } />
        <Text component={ 'strong' } className='ins-c-warning-text'>
            Unsupported SSG version ({ ssgVersion })
        </Text>
        <Popover position='right' { ...{ bodyContent, footerContent } }>
            <OutlinedQuestionCircleIcon
                style={ { marginLeft: '.5em', cursor: 'pointer', color: 'var(--pf-global--Color--200)' } } />
        </Popover>
    </div>;
};

UnsupportedSSGVersion.propTypes = {
    ssgVersion: propTypes.string
};

export default UnsupportedSSGVersion;
