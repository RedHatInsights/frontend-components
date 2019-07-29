import {
    Bullseye,
    Button,
    Card,
    CardBody,
    CardHeader,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    TextContent,
    TextList,
    TextListItem,
    Title
} from '@patternfly/react-core';
import { CubesIcon, ExternalLinkAltIcon, FrownOpenIcon } from '@patternfly/react-icons';
import moment from 'moment';
import React from 'react';

// Reports that no CVEs were found after filtering results
export const FilterNotFoundForCVE = (
    <Bullseye>
        <EmptyState>
            <Title headingLevel="h5" size="lg">
                No matching CVEs found
            </Title>
            <TextContent>
                <EmptyStateBody>
                    This may be for one of the following reasons:
                    <TextList>
                        <TextListItem>The criteria/filters you’ve specified result in no/zero CVEs being reported in your environment</TextListItem>
                    </TextList>
                    If you think a CVE that matches this criteria does apply to Red Hat, or would like more information, please contact{ ' ' }
                    <a href="https://access.redhat.com/security/team/contact/" target="__blank" rel="noopener noreferrer">
                        Red Hat Product Security <ExternalLinkAltIcon />
                    </a>
                    .
                </EmptyStateBody>
            </TextContent>
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
            <TextContent>
                <EmptyStateBody>
                    This may be for one of the following reasons:
                    <TextList>
                        <TextListItem>No published CVEs affect this system</TextListItem>
                        <TextListItem>You have opted out of reporting on a reported CVE</TextListItem>
                    </TextList>
                    If you think this system has applicable CVEs, or would like more information, please contact{ ' ' }
                    <a href="https://access.redhat.com/security/team/contact/" target="__blank" rel="noopener noreferrer">
                        Red Hat Product Security <ExternalLinkAltIcon />
                    </a>
                    .
                </EmptyStateBody>
            </TextContent>
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
            <TextContent>
                <EmptyStateBody>
                    This may be for one of the following reasons:
                    <TextList>
                        <TextListItem>No published CVEs affect these systems</TextListItem>
                        <TextListItem>You have opted out of reporting on a reported CVE</TextListItem>
                    </TextList>
                    If you think this system has applicable CVEs, or would like more information, please contact{ ' ' }
                    <a href="https://access.redhat.com/security/team/contact/" target="__blank" rel="noopener noreferrer">
                        Red Hat Product Security <ExternalLinkAltIcon />
                    </a>
                    .
                </EmptyStateBody>
            </TextContent>
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
            <Button variant="primary" component="a" href="http://access.redhat.com/products/cloud-management-services-for-rhel#getstarted">
                Learn about the Insights client
            </Button>
        </EmptyState>
    </Bullseye>
);

// Generic error
export const GenericError = (
    <Card className="ins-empty-rule-cards">
        <CardHeader>
            <FrownOpenIcon size="lg" />
        </CardHeader>
        <CardBody>There was an error getting data. Reload the page and try again</CardBody>
    </Card>
);

// Read-only mode notification text
export const ReadOnlyNotification = {
    title: 'Changes not saved',
    detail:
        ' The application is temporarily in read-only mode due to normal system maintenance.\
    Please try again later. Check status.redhat.com for more information.'
};

//CVSS Base score label to value
export const CVSSOptions = [
    { value: 'all', label: 'All' },
    { value: 'less3', label: '0.0 - 2.9', to: 2.999 },
    { value: 'from3to6', label: '3.0 - 6.9', from: 3, to: 6.999 },
    { value: 'from6to8', label: '7.0 - 10.0', from: 7, to: 10 }
];

//Public date labels to value

export const PublicDateOptions = [
    { value: 'all', label: 'All' },
    { value: 'last7', label: 'Last 7 days', from: moment().subtract(7, 'days') },
    { value: 'last30', label: 'Last 30 days', from: moment().subtract(30, 'days') },
    { value: 'last90', label: 'Last 90 days', from: moment().subtract(90, 'days') },
    { value: 'lastYear', label: 'Last year', from: moment().subtract(1, 'years') },
    { value: 'MoreThanYear', label: 'More than 1 year ago', to: moment().subtract(1, 'years') }
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
    values: [
        { label: 'Critical', value: '7' },
        { label: 'Important', value: '5' },
        { label: 'Moderate', value: '4' },
        { label: 'Low', value: '2' },
        { label: 'Unknown', value: '0,1' }
    ]
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
