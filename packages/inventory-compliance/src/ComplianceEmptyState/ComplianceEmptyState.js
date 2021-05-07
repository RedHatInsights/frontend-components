import React from 'react';
import propTypes from 'prop-types';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import {
    Title,
    TextContent,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStatePrimary,
    EmptyStateSecondaryActions,
    EmptyStateIcon
} from '@patternfly/react-core';
import { CloudSecurityIcon } from '@patternfly/react-icons';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { ErrorCard } from '../PresentationalComponents';
import { EMPTYSTATE_LEARNMORE } from '../Constants';
const COMPLIANCE_API_ROOT = '/api/compliance';

const QUERY = gql`
{
    profiles(search: "external = false and canonical = false") {
        totalCount
    }
}
`;

const ComplianceEmptyState = ({ title, mainButton, client }) => {
    let { data, error, loading } = useQuery(QUERY, { fetchPolicy: 'network-only', client: client });

    if (loading) { return <Spinner/>; }

    if (error) {
        const errorMsg = `Oops! Error loading System data: ${error}`;
        return <ErrorCard message={errorMsg} />;
    }

    const policiesCount = data.profiles.totalCount;

    const policyWord = policiesCount > 1 ? 'policies' : 'policy';
    const haveWord = policiesCount > 1 ? 'have' : 'has';

    return <Bullseye>
        <EmptyState>
            <EmptyStateIcon style={{ fontWeight: '500', color: 'var(--pf-global--primary-color--100)' }}
                size="xl" title="Compliance" icon={CloudSecurityIcon} />
            <Title headingLevel="h1" size="lg">{ title }</Title>
            <br/>
            <EmptyStateBody>
                { policiesCount > 0 &&
                    <TextContent>
                        <a href='insights/compliance/scappolicies'>{policiesCount} {policyWord}</a> {haveWord} been created but {haveWord} no reports.
                    </TextContent> }
                <TextContent>
                    The Compliance service uses SCAP policies to track your organization&#39;s adherence to
                    compliance requirements.
                </TextContent>
                <TextContent>
                    Get started by adding a policy, or read documentation about how to connect OpenSCAP to the
                    Compliance service.
                </TextContent>
            </EmptyStateBody>
            <EmptyStatePrimary>
                { mainButton }
            </EmptyStatePrimary>
            <EmptyStateSecondaryActions>
                <Button variant='link' component='a' target='_blank' rel='noopener noreferrer' href={ EMPTYSTATE_LEARNMORE }>
                    Learn about OpenSCAP and Compliance
                </Button>
            </EmptyStateSecondaryActions>
        </EmptyState>
    </Bullseye>;
};

ComplianceEmptyState.propTypes = {
    title: propTypes.string,
    mainButton: propTypes.object,
    client: propTypes.object
};

ComplianceEmptyState.defaultProps = {
    title: 'No policies',
    mainButton: <Button
        variant="primary"
        component="a"
        href="/insights/compliance/scappolicies">
        Create new policy
    </Button>,
    client: new ApolloClient({
        link: new HttpLink({
            uri: COMPLIANCE_API_ROOT + '/graphql',
            credentials: 'include'
        }),
        cache: new InMemoryCache()
    })
};

export default ComplianceEmptyState;
