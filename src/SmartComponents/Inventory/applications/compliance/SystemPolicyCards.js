import React from 'react';
import { Grid, GridItem, Card, CardBody } from '@patternfly/react-core';
import routerParams from '../../../../Utilities/RouterParams';
import SystemPolicyCard from './SystemPolicyCard';
import propTypes from 'prop-types';
import { Instagram } from 'react-content-loader';

class SystemPolicyCards extends React.Component {
    render() {
        const { policies, loading } = this.props;
        return (
            <div id="system_policy_cards">
                <Grid gutter='md'>
                    { policies.map((policy, i) => (
                        <GridItem span={ 4 } key={ i }>
                            <SystemPolicyCard policy={ policy } />
                        </GridItem>
                    )) }
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
            </div>
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

export default routerParams(SystemPolicyCards);
