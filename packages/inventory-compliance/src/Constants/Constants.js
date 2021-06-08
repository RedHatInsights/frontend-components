/* eslint max-len: 0 */
import React from 'react';
import {
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    QuestionCircleIcon
} from '@patternfly/react-icons';

export const REMEDIATIONS_COLUMN = 4;
export const COMPLIANT_COLUMN = 3;
export const SEVERITY_COLUMN = 2;
export const POLICY_COLUMN = 1;
export const TITLE_COLUMN = 0;

const LowSeverityIcon = <svg width="1em" height="1em" viewBox="0 0 18 18" role="img" style={ { verticalAlign: '-0.125em' } } xmlns="http://www.w3.org/2000/svg"><path d="M2 0h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6.67 10.46a1.67 1.67 0 1 0 0 3.338 1.67 1.67 0 0 0 0-3.338zm-1.586-6l.27 4.935a.435.435 0 0 0 .434.411H9.55c.232 0 .422-.18.435-.411l.27-4.936A.435.435 0 0 0 9.818 4h-2.3c-.25 0-.448.21-.435.46z" fill="#3A9CA6" fillRule="evenodd"/></svg>;

export const HIGH_SEVERITY = <React.Fragment><ExclamationCircleIcon className='ins-u-failed'/> High</React.Fragment>;
export const MEDIUM_SEVERITY = <React.Fragment><ExclamationTriangleIcon className='ins-u-warning'/> Medium</React.Fragment>;
export const LOW_SEVERITY = <React.Fragment>{ LowSeverityIcon } Low</React.Fragment>;
export const UNKNOWN_SEVERITY = <React.Fragment><QuestionCircleIcon /> Unknown</React.Fragment>;
export const EMPTYSTATE_LEARNMORE = 'https://access.redhat.com/documentation/en-us/red_hat_insights/2021/html/assessing_and_monitoring_security_policy_compliance_of_rhel_systems/index';
