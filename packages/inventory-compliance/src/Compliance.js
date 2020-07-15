import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import SystemPolicyCards from './SystemPolicyCards';
import SystemRulesTable from './SystemRulesTable';
import ComplianceEmptyState from './ComplianceEmptyState';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { columns } from './defaultColumns';
import {
    Card,
    CardBody,
    CardHeader
} from '@patternfly/react-core';
import { NotEqualIcon } from '@patternfly/react-icons';
import './compliance.scss';
import { IntlProvider } from 'react-intl';

const COMPLIANCE_API_ROOT = '/api/compliance';

const QUERY = gql`
query System($systemId: String!){
    system(id: $systemId) {
        id
        name
        profiles {
            name
            refId
            compliant
            rulesFailed
            rulesPassed
            lastScanned
            score
            policy {
                id
            }
            benchmark {
                version
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

const SystemQuery = ({ data, loading, hidePassed }) => (
    <React.Fragment>
        <SystemPolicyCards policies={ data.system && data.system.profiles } loading={ loading } />
        <br/>
        <SystemRulesTable hidePassed={ hidePassed }
            system={ data.system }
            columns={ columns }
            profileRules={ data.system && data.system.profiles.map((profile) => ({
                system: data.system.id,
                profile: { refId: profile.refId, name: profile.name },
                rules: profile.rules
            })) }
            loading={ loading }
        />
    </React.Fragment>
);

class SystemDetails extends Component {
    componentWillUnmount() {
        const { client } = this.props;
        client && client.clearStore && client.clearStore();
    }

    renderError = (error) => {
        const errorMsg = `Oops! Error loading System data: ${error}`;
        return (error.networkError && error.networkError.statusCode === 404) ?
            <ComplianceEmptyState title='No policies are reporting' /> :
            <Card className="ins-error-card">
                <CardHeader>
                    <NotEqualIcon />
                </CardHeader>
                <CardBody>
                    <div>{ errorMsg }</div>
                </CardBody>
            </Card>;
    }

    render() {
        const { inventoryId, hidePassed, client } = this.props;

        return (
            <ApolloProvider client={ client }>
                <Query query={ QUERY } variables={ { systemId: inventoryId } }>
                    { ({ data, error, loading }) => (
                        error ?
                            this.renderError(error) :
                            <SystemQuery hidePassed={ hidePassed } data={ data } error={ error } loading={ loading } />
                    ) }
                </Query>
            </ApolloProvider>
        );
    }
}

SystemDetails.propTypes = {
    inventoryId: propTypes.string,
    columns: propTypes.shape([
        {
            title: propTypes.oneOfType([ propTypes.string, propTypes.object ]).isRequired,
            transforms: propTypes.array.isRequired,
            original: propTypes.string
        }
    ]),
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
    data: {
        system: {
            profiles: []
        }
    },
    loading: true
};

const WrappedSystemDetails = ({ customItnl, intlProps, ...props }) => {
    const IntlWrapper = customItnl ? IntlProvider : Fragment;
    return <IntlWrapper { ...customItnl && intlProps } >
        <SystemDetails { ...props } />
    </IntlWrapper>;
};

export default WrappedSystemDetails;
