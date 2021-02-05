import React from 'react';
import propTypes from 'prop-types';
import { Text, TextVariants, TextContent } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, QuestionCircleIcon } from '@patternfly/react-icons';

const ruleProp = {
    rule: propTypes.object
};

export const Rule = ({ rule: { title, identifier } }) => (
    <TextContent>
        { title }
        { identifier && <Text component={ TextVariants.small }>{ identifier.label }</Text> || '' }
    </TextContent>
);
Rule.propTypes = ruleProp;

export const Policy = ({ rule: { profile } }) => (
    profile.name
);
Policy.propTypes = ruleProp;

export const HighSeverity = () => (
    <React.Fragment>
        <ExclamationCircleIcon className='ins-u-failed'/> High
    </React.Fragment>
);

export const MediumSeverity = () => (
    <React.Fragment>
        <ExclamationTriangleIcon className='ins-u-warning'/> Medium
    </React.Fragment>
);

const LowSeverityIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 18" role="img" style={ { verticalAlign: '-0.125em' } } xmlns="http://www.w3.org/2000/svg"><path d="M2 0h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6.67 10.46a1.67 1.67 0 1 0 0 3.338 1.67 1.67 0 0 0 0-3.338zm-1.586-6l.27 4.935a.435.435 0 0 0 .434.411H9.55c.232 0 .422-.18.435-.411l.27-4.936A.435.435 0 0 0 9.818 4h-2.3c-.25 0-.448.21-.435.46z" fill="#3A9CA6" fillRule="evenodd"/></svg> // eslint-disable-line
);

export const LowSeverity = () => (
    <React.Fragment>{ LowSeverityIcon } Low</React.Fragment>
);

export const UNKNOWN_SEVERITY = () => (
    <React.Fragment><QuestionCircleIcon /> Unknown</React.Fragment>
);

export const Severity = ({ rule: { severity } }) => (
    {
        high: <HighSeverity />,
        medium: <MediumSeverity />,
        low: <LowSeverity />
    }[severity.toLowerCase()] || severity
);

Severity.propTypes = ruleProp;

export const Passed = ({ rule: { compliant } }) => (
    compliant ? <CheckCircleIcon className='ins-u-passed' /> : <ExclamationCircleIcon className='ins-u-failed' />
);
Passed.propTypes = ruleProp;

export const Ansible = ({ rule: { remediationAvailable } }) => (
    remediationAvailable ? <CheckCircleIcon className='ins-u-passed' /> : 'No'
);
Ansible.propTypes = ruleProp;
