import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import RemediationButton from '../../../Remediations/RemediationButton';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const GET_FAILED_RULES = gql`
query FailedRulesForSystem($systemIdsQuery: String!){
    allSystems(search: $systemIdsQuery) {
        id,
        rule_objects_failed {
            ref_id
        }
    }
}
`;

const FailedRulesQuery = graphql(GET_FAILED_RULES, {
    options: (props) => ({ variables: { systemIdsQuery: 'id ^ (' + props.selectedEntities + ')' }}),
    props: ({ data }) => (data)
});

class ComplianceRemediationButton extends React.Component {
    constructor(props) {
        super(props);
        this.dataProvider = this.dataProvider.bind(this);
    }

    dataProvider() {
        let result = { issues: [], systems: []};
        if (this.props.allSystems === undefined) {
            return result;
        }

        // 1 host, multiple rules
        if (this.props.selectedRules !== undefined && this.props.allSystems.length === 1) {
            result.systems.push(this.props.allSystems[0].id);

            for (const rule of this.props.selectedRules) {
                result.issues.push({ id: rule });
            }
        // Multiple hosts, multiple rules
        } else {
            for (const system of this.props.allSystems) {
                result.systems.push(system.id);

                for (const rule of system.rule_objects_failed) {
                    result.issues.push({ id: rule.ref_id });
                }
            }
        }

        return result;
    }

    render() {
        return (
            <React.Fragment>
                <RemediationButton dataProvider={ this.dataProvider } />
            </React.Fragment>
        );
    }
}

ComplianceRemediationButton.propTypes = {
    selectedEntities: propTypes.array,
    selectedRules: propTypes.array,
    allSystems: propTypes.array // Prop coming from data.allSystems GraphQL query
};

const mapStateToProps = state => {
    if (state.entities === undefined || state.entities.entities === undefined) {
        return { selectedEntities: []};
    }

    return {
        selectedEntities: state.entities.entities.
        filter(entity => entity.selected).
        map(entity => entity.id)
    };
};

export default compose(
    connect(mapStateToProps),
    FailedRulesQuery
)(ComplianceRemediationButton);
