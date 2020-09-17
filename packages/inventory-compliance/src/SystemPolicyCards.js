import React from 'react';
import { Grid, GridItem, Card, CardBody } from '@patternfly/react-core';
import SystemPolicyCard from './SystemPolicyCard';
import propTypes from 'prop-types';
import { Instagram } from 'react-content-loader';

class SystemPolicyCards extends React.Component {
    systemPolicyCards() {
        const { policies } = this.props;
        return policies.filter((policy) => (policy.rulesFailed + policy.rulesPassed) > 0).map(
            (policy, i) =>
                <GridItem sm={ 12 } md={ 12 } lg={ 6 } xl={ 4 } key={ i }>
                    <SystemPolicyCard policy={ policy } />
                </GridItem>
        );
    }

    render() {
        const { loading } = this.props;

        return (
            <React.Fragment>
                <Grid hasGutter>
                    { this.systemPolicyCards() }
                    { loading && [ ...Array(3) ].map((_item, i) => (
                        <GridItem span={ 4 } key={ i }>
                            <Card>
                                <CardBody>
                                    <Instagram />
                                </CardBody>
                            </Card>
                        </GridItem>
                    )) }
                </Grid>
            </React.Fragment>
        );
    }
}

SystemPolicyCards.propTypes = {
    policies: propTypes.array,
    loading: propTypes.bool
};

SystemPolicyCards.defaultProps = {
    policies: []
};

export default SystemPolicyCards;
