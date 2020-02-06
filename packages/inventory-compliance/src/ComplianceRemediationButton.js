import React from 'react';
import propTypes from 'prop-types';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import flatten from 'lodash/flatten';
import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { AnsibeTowerIcon } from '@patternfly/react-icons';
import { global_BackgroundColor_100 as globalBackgroundColor100 } from '@patternfly/react-tokens';

class ComplianceRemediationButton extends React.Component {
    formatRule = ({ title, refId }, profile, system) => ({
        id: `ssg:rhel7|${profile}|${refId}`,
        description: title,
        systems: [
            system
        ]
    })

    findRule = (rules, refId) => {
        return rules.find(rule => rule.refId === refId.split('|')[2]);
    }

    uniqIssuesBySystem = (issues) => {
        const issueIds = issues.map((issue) => issue.id);
        return issues.filter((issue, index) => {
            const originalIssueIndex = issueIds.indexOf(issue.id);
            return (originalIssueIndex === index) ? true :
                (issues[originalIssueIndex].systems = issues[originalIssueIndex].systems.concat(issue.systems)) && false;
        });
    }

    rulesWithRemediations = (rules, systemId) => {
        return rules.filter(rule => rule.remediationAvailable).map(
            rule => this.formatRule(rule, rule.refId.split('|')[1], systemId)
        );
    }

    dataProvider = () => {
        const { allSystems, selectedRules } = this.props;
        const result = { systems: [], issues: [] };
        allSystems.forEach(async (system) => {
            result.systems.push(system.id);
            if (selectedRules.length !== 0) {
                result.issues.push(this.rulesWithRemediations(selectedRules, system.id));
            } else {
                result.issues.push(this.rulesWithRemediations(system.ruleObjectsFailed, system.id));
            }
        });

        return Promise.all(result.issues).then(issues => {
            result.issues = this.uniqIssuesBySystem(flatten(issues));
            return result;
        });
    }

    noRemediationAvailable = () => {
        const { allSystems, selectedRules } = this.props;
        return selectedRules.length === 0 && !allSystems.some((system) => system.ruleObjectsFailed.some((rule) => rule.remediationAvailable));
    }

    render() {
        const { addNotification } = this.props;

        return (
            <React.Fragment>
                <RemediationButton
                    isDisabled={ this.noRemediationAvailable() }
                    onRemediationCreated={ result => addNotification(result.getNotification()) }
                    dataProvider={ this.dataProvider }
                >
                    <AnsibeTowerIcon size='sm' color={globalBackgroundColor100.value} />
                    &nbsp;Remediate
                </RemediationButton>
            </React.Fragment>
        );
    }
}

ComplianceRemediationButton.propTypes = {
    selectedRules: propTypes.array,
    allSystems: propTypes.array, // Prop coming from data.allSystems GraphQL query
    addNotification: propTypes.func
};

ComplianceRemediationButton.defaultProps = {
    allSystems: []
};

export default connect(
    () => ({}),
    dispatch => ({
        addNotification: notification => dispatch(addNotification(notification))
    })
)(ComplianceRemediationButton);
