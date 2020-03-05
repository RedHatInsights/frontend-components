import { sortable } from '@patternfly/react-table';
import React from 'react';
import { ANSIBLE_ICON } from './Constants';

export const columns = [
    { title: 'Rule', transforms: [ sortable ] },
    { title: 'Policy', transforms: [ sortable ] },
    { title: 'Severity', transforms: [ sortable ] },
    { title: 'Passed', transforms: [ sortable ] },
    { title: <React.Fragment>{ ANSIBLE_ICON } Ansible</React.Fragment>, original: 'Ansible', transforms: [ sortable ] }
];
