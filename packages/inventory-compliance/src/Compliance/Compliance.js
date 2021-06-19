import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import SystemPolicyCards from '../SystemPolicyCards';
import SystemRulesTable, { columns } from '../SystemRulesTable';
import ComplianceEmptyState from '../ComplianceEmptyState';
import { useQuery } from '@apollo/react-hooks';
import { PlusCircleIcon, CloudSecurityIcon } from '@patternfly/react-icons';
import {
    Title,
    TextContent,
    Bullseye,
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStatePrimary,
    EmptyStateSecondaryActions,
    EmptyStateIcon
} from '@patternfly/react-core';
import gql from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './compliance.scss';
import { ErrorCard } from '../PresentationalComponents';
import { IntlProvider } from 'react-intl';

const COMPLIANCE_API_ROOT = '/api/compliance';

const QUERY = gql`
query System($systemId: String!){
    system(id: $systemId) {
        id
        name
        hasPolicy
        policies {
            id
        }
        testResultProfiles {
            id
            name
            policyType
            refId
            compliant
            rulesFailed
            rulesPassed
            lastScanned
            score
            supported
            ssgVersion
            majorOsVersion
            policy {
                id
            }
            rules {
                title
                severity
                rationale
                refId
                description
                compliant
                remediationAvailable
                references
                identifier
            }
        }
    }
}
`;

const NoPoliciesState = ({ system }) => (
    system?.hasPolicy ? null : <Bullseye>
        <EmptyState>
            <EmptyStateIcon icon={PlusCircleIcon} />
            <Title headingLevel="h1" size="lg">This system is not part of any SCAP policies defined within Compliance.</Title>
            <EmptyStateBody>
                To assess and monitor compliance against a SCAP policy for this system,
                add it to an existing policy or create a new policy.
            </EmptyStateBody>
            <EmptyStatePrimary>
                <Button
                    ouiaId="CreateNewPolicyButton"
                    variant="primary"
                    component="a"
                    href="/insights/compliance/scappolicies/new">
                    Create a policy
                </Button>
            </EmptyStatePrimary>
            <EmptyStateSecondaryActions>
                <Button variant='link' component='a' href='/insights/compliance/scappolicies'>
                    View compliance policies
                </Button>
            </EmptyStateSecondaryActions>
        </EmptyState>
    </Bullseye>
);

NoPoliciesState.propTypes = {
    system: propTypes.shape({
        hasPolicy: propTypes.bool
    })
};

const NoReportsState = ({ system }) => (
    system?.hasPolicy && !system.testResultProfiles?.length ? <Bullseye>
        <EmptyState>
            <EmptyStateIcon
                icon={CloudSecurityIcon} title="Compliance" size="xl"
                style={{ fontWeight: '500', color: 'var(--pf-global--primary-color--100)' }} />
            <Title headingLevel="h1" size="lg">No results reported</Title>
            <EmptyStateBody>
                This system is part of { system.policies.length }
                { system.policies.length > 1 ? ' policies' : ' policy' },
                but has not returned any results.
            </EmptyStateBody>
            <EmptyStateBody>
                Reports are returned when the system checks into Insights.
                By default, systems check in every 24 hours.
            </EmptyStateBody>
        </EmptyState>
    </Bullseye> : null
);

NoReportsState.propTypes = {
    system: propTypes.shape({
        hasPolicy: propTypes.bool,
        testResultProfiles: propTypes.array,
        policies: propTypes.array
    })
};

const SystemQuery = ({ data: { system }, loading, hidePassed }) => (
    <React.Fragment>
        <SystemPolicyCards policies={ system?.testResultProfiles } loading={ loading } />
        <NoPoliciesState system={ system } />
        <NoReportsState system={ system } />
        <br/>
        { system?.testResultProfiles?.length ?
            <SystemRulesTable
                hidePassed={ hidePassed }
                sortBy={{
                    index: 4,
                    direction: 'asc',
                    property: 'severity'
                }}
                system={ {
                    ...system,
                    supported: ((system?.testResultProfiles || []).filter((profile) => (profile.supported)).length > 0)
                } }
                columns={ columns }
                profileRules={ system?.testResultProfiles.map(profile => ({
                    system,
                    profile,
                    rules: profile.rules
                })) }
                loading={ loading } /> : undefined }
    </React.Fragment>
);

SystemQuery.propTypes = {
    data: propTypes.shape({
        system: propTypes.shape({
            hasPolicy: propTypes.bool,
            policies: propTypes.shape({
                id: propTypes.string
            }),
            profiles: propTypes.array,
            testResultProfiles: propTypes.array
        })
    }),
    loading: propTypes.bool,
    hidePassed: propTypes.bool
};

SystemQuery.defaultProps = {
    loading: true
};

const SystemDetails = ({ inventoryId, hidePassed, client }) => {
    let { data, error, loading } = useQuery(QUERY, {
        variables: { systemId: inventoryId },
        client: client
    });
    const is404 = error?.networkError?.statusCode === 404;

    if (loading) {
        return <Spinner/>;
    }

    if (error && !is404) {
        const errorMsg = `Oops! Error loading System data: ${error}`;
        return <ErrorCard message={errorMsg} />;
    }

    return <div className="ins-c-compliance__scope">
        { !data?.system || is404 ?
            <ComplianceEmptyState title='No policies are reporting for this system' /> :
            <SystemQuery hidePassed={ hidePassed } data={ data } loading={ loading } /> }
    </div>;
};

SystemDetails.propTypes = {
    inventoryId: propTypes.string,
    client: propTypes.object,
    hidePassed: propTypes.bool
};

SystemDetails.defaultProps = {
    client: new ApolloClient({
        link: new HttpLink({
            uri: COMPLIANCE_API_ROOT + '/graphql',
            credentials: 'include'
        }),
        cache: new InMemoryCache()
    })
};

const WrappedSystemDetails = ({ customItnl, intlProps, ...props }) => {
    const IntlWrapper = customItnl ? IntlProvider : React.Fragment;

    return <IntlWrapper { ...customItnl && intlProps } >
        <SystemDetails { ...props } />
    </IntlWrapper>;
};

WrappedSystemDetails.propTypes = {
    customItnl: propTypes.elementType,
    intlProps: propTypes.object
};

export default WrappedSystemDetails;
