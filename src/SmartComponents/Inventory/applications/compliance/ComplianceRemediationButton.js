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
            ref_id,
            title
        }
    }
}
`;

const FailedRulesQuery = graphql(GET_FAILED_RULES, {
    options: (props) => ({ variables: { systemIdsQuery: 'id ^ (' + props.selectedEntities.map(entity => entity.id) + ')' }}),
    props: ({ data }) => (data)
});

class ComplianceRemediationButton extends React.Component {
    constructor(props) {
        super(props);
    }

    /* eslint-disable camelcase */
    formatRule = ({ title, ref_id }, system) => ({
        id: `compliance:${ref_id}`,
        description: title,
        systems: [
            system
        ]
    })

    dataProvider = () => {
        const { allSystems, selectedRules } = this.props;
        return allSystems.reduce((acc, { id, rule_objects_failed }) => ({
            systems: [ ...acc.systems, id ],
            issues: [
                ...acc.issues,
                ...selectedRules ?
                    selectedRules.map(rule => this.formatRule(rule, id)) :
                    rule_objects_failed.map(rule => this.formatRule(rule, id))
            ]
        }), { issues: [], systems: []});
        /* eslint-enable camelcase */
    }

    render() {
        const { disableRemediations } = this.props;
        return (
            <React.Fragment>
                <RemediationButton
                    isDisabled={ disableRemediations || this.dataProvider().issues.length === 0 }
                    dataProvider={ this.dataProvider }
                />
            </React.Fragment>
        );
    }
}

ComplianceRemediationButton.propTypes = {
    selectedEntities: propTypes.array,
    selectedRules: propTypes.array,
    allSystems: propTypes.array, // Prop coming from data.allSystems GraphQL query
    disableRemediations: propTypes.bool
};

ComplianceRemediationButton.defaultProps = {
    disableRemediations: false,
    allSystems: []
};

const mapStateToProps = ({ entities, entityDetails }) => ({
    selectedEntities: entities && entities.rows ?
        entityDetails && entityDetails.entity ?
            [ entityDetails.entity ] :
            entities.rows.filter(entity => entity.selected) :
        []

});

export default compose(
    connect(mapStateToProps),
    FailedRulesQuery
)(ComplianceRemediationButton);
