import { Bullseye, Button, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import React from 'react';
import moment from 'moment';

// Reports that no CVEs were found after filtering results
export const FilterNotFoundForCVE = (
    <Bullseye>
        <EmptyState>
            <Title headingLevel="h5" size="lg">
                No matching CVEs found
            </Title>
            <Title headingLevel="h4" size="md">
                This may be for one of the following reasons:
            </Title>
            <EmptyStateBody>
                <ul>
                    <li> The criteria/filters you’ve specified result in no/zero CVEs being reported in your environment</li>
                    <li>
                        If you think a CVE that matches this criteria does apply to Red Hat, or would like more information, please contact the
                        Security Response Team
                    </li>
                    <li>In addition, the MITRE CVE dictionary may provide information about your CVE</li>
                </ul>
            </EmptyStateBody>
        </EmptyState>
    </Bullseye>
);

// Selected system do not have any CVEs
export const EmptyCVEListForSystem = (
    <Bullseye>
        <EmptyState>
            <Title headingLevel="h5" size="lg">
                No CVEs reported for this system
            </Title>
            <Title headingLevel="h4" size="md">
                This may be for one of the following reasons:
            </Title>
            <EmptyStateBody>
                <ul>
                    <li>No published CVEs affect this system</li>
                    <li>You have opted out of reporting on a reported CVE</li>
                    <li>If you think this system has applicable CVEs, or would like more information, please contact the Security Response Team.</li>
                </ul>
            </EmptyStateBody>
        </EmptyState>
    </Bullseye>
);

// None of my systems is affected
export const EmptyCVEList = (
    <Bullseye>
        <EmptyState>
            <Title headingLevel="h5" size="lg">
                No CVEs reported for connected systems
            </Title>
            <Title headingLevel="h4" size="md">
                This may be for one of the following reasons:
            </Title>
            <EmptyStateBody>
                <ul>
                    <li>No published CVEs affect these systems</li>
                    <li>You have opted out of reporting on a reported CVE</li>
                    <li>If you think this system has applicable CVEs, or would like more information, please contact the Security Response Team.</li>
                </ul>
            </EmptyStateBody>
        </EmptyState>
    </Bullseye>
);

// Indicates that Insights is not activated
export const NoVulnerabilityData = (
    <Bullseye>
        <EmptyState>
            <EmptyStateIcon icon={ CubesIcon } />
            <Title headingLevel="h5" size="lg">
                No vulnerability data
            </Title>
            <EmptyStateBody>Activate the Insights client for this system to report for vulnerabilities</EmptyStateBody>
            <Button variant="primary">Learn about the insights client</Button>
        </EmptyState>
    </Bullseye>
);

// Generic error
export const GenericError = (
    <Bullseye>
        <EmptyState>
            <EmptyStateIcon icon={ CubesIcon } />
            <Title headingLevel="h5" size="lg">
                There was an error loading resources
            </Title>
        </EmptyState>
    </Bullseye>
);

//CVSS Base score label to value
export const CVSSOptions = [
    { value: 'all', label: 'All' },
    { value: 'less4', label: 'Less than 4', to: 3.999 },
    { value: 'from4less6', label: '4 - 6', from: 4, to: 5.999 },
    { value: 'from6to8', label: '6 - 8', from: 6, to: 7.999 },
    { value: 'from8to10', label: '8 - 10', from: 8, to: 10 }
];

//Public date labels to value

export const PublicDateOptions = [
    { value: 'all', label: 'All' },
    { value: 'last7', label: 'Last 7 days', from: moment().subtract(7, 'days') },
    { value: 'last30', label: 'Last 30 days', from: moment().subtract(30, 'days') },
    { value: 'last90', label: 'Last 90 days', from: moment().subtract(90, 'days') },
    { value: 'lastYear', label: 'Last year', from: moment().subtract(1, 'years') },
    { value: 'MoreThanYear', label: 'More than 1 year ago',  to: moment().subtract(1, 'years') }
];

// Filter categories
export const filtersShowAll = {
    type: 'checkbox',
    title: '',
    urlParam: 'show_all',
    isChecked: true,
    values: [{ label: 'Hide CVEs that do not affect my inventory', value: 'true' }]
};

export const filtersSeverity = {
    type: 'checkbox',
    title: 'Severity',
    urlParam: 'severity',
    values: [{ label: 'Critical', value: '7' }, { label: 'High', value: '5' }, { label: 'Medium', value: '4' }, { label: 'Low', value: '2' }]
};

export const filtersCVSSScore = {
    type: 'radio',
    title: 'CVSS Base',
    urlParam: 'cvss_filter',
    values: CVSSOptions.map(item => ({ label: item.label, value: item.value }))
};

export const filtersPublishDate = {
    type: 'radio',
    title: 'Publish date',
    urlParam: 'publish_date',
    values: PublicDateOptions.map(item => ({ label: item.label, value: item.value }))
};
