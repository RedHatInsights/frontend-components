import React, { Component } from 'react';
import propTypes from 'prop-types';
import routerParams from '../../../../Utilities/RouterParams';
import SystemPolicyCards from './SystemPolicyCards';
import SystemRulesTable from './SystemRulesTable';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ClipboardCheckIcon } from '@patternfly/react-icons';
import {
    Card,
    CardBody,
    CardHeader,
    Title,
    Text,
    TextContent,
    TextVariants,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import { NotEqualIcon } from '@patternfly/react-icons';
import './compliance.scss';

const COMPLIANCE_API_ROOT = '/api/compliance';

const QUERY = gql`
query System($systemId: String!){
    system(id: $systemId) {
        id
        name
        profiles {
            name
            ref_id
            compliant(system_id: $systemId)
            rules_failed(system_id: $systemId)
            rules_passed(system_id: $systemId)
            last_scanned(system_id: $systemId)
            rules {
                title
                severity
                rationale
                ref_id
                description
                compliant(system_id: $systemId)
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
            profileRules={ data.system && data.system.profiles.map((profile) => ({
                profile: profile.name,
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
            <Bullseye>
                <EmptyState>
                    <EmptyStateIcon size="xl" title="Compliance" icon={ ClipboardCheckIcon } />
                    <br/>
                    <Title size="lg">Welcome to Compliance</Title>
                    <EmptyStateBody>
                        <TextContent>
                            You have not uploaded any reports yet. Please generate a report using
                            OpenSCAP:
                            <Text component={ TextVariants.blockquote }>
                                oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_standard
                                --results scan.xml /usr/share/xml/scap/ssg/content/ssg-rhel7-ds.xml
                            </Text>
                            and upload it using the following command:
                            <Text component={ TextVariants.blockquote }>
                                sudo insights-client --verbose --payload scan.xml
                                --content-type application/vnd.redhat.compliance.something+tgz
                            </Text>
                        </TextContent>
                    </EmptyStateBody>

                    <Button
                        variant="primary"
                        component="a"
                        target="_blank"
                        href="https://www.open-scap.org/getting-started/">
                        Get started with OpenSCAP
                    </Button>
                </EmptyState>
            </Bullseye> :
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
        const { match: { params: { inventoryId }}, hidePassed, client } = this.props;
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
    match: propTypes.shape({
        params: propTypes.shape({
            inventoryId: propTypes.string
        })
    }),
    client: propTypes.object,
    hidePassed: propTypes.bool
};

SystemDetails.defaultProps = {
    match: {
        params: {}
    },
    client: new ApolloClient({
        link: new HttpLink({ uri: COMPLIANCE_API_ROOT + '/graphql' }),
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

export default routerParams(SystemDetails);
