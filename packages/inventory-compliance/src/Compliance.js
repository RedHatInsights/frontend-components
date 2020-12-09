import React from 'react';
import propTypes from 'prop-types';
import SystemPolicyCards from './SystemPolicyCards';
import SystemRulesTable, { columns } from './SystemRulesTable';
import ComplianceEmptyState from './ComplianceEmptyState';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import './compliance.scss';
import { ErrorCard } from './PresentationalComponents';
import { IntlProvider } from 'react-intl';

const COMPLIANCE_API_ROOT = '/api/compliance';

const QUERY = gql`
query System($systemId: String!){
    system(id: $systemId) {
        id
        name
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

const SystemQuery = ({ data: { system }, loading, hidePassed }) => (
    <React.Fragment>
        <SystemPolicyCards policies={ system?.testResultProfiles } loading={ loading } />
        <br/>
        <SystemRulesTable hidePassed={ hidePassed }
            system={ system }
            columns={ columns }
            profileRules={ system?.testResultProfiles.map(profile => ({
                system: system.id,
                profile,
                rules: profile.rules
            })) }
            loading={ loading } />
    </React.Fragment>
);

SystemQuery.propTypes = {
    data: propTypes.shape({
        system: propTypes.shape({
            profiles: propTypes.array
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

    return <React.Fragment>
        { !data?.system || is404 ?
            <ComplianceEmptyState title='No policies are reporting for this system' /> :
            <SystemQuery hidePassed={ hidePassed } data={ data } loading={ loading } /> }
    </React.Fragment>;
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

export default WrappedSystemDetails;
