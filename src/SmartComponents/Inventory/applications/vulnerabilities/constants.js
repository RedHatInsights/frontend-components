import { Bullseye, Button, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import React from 'react';

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
