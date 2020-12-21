import React from 'react';
import propTypes from 'prop-types';
import { RemediationButton } from '@redhat-cloud-services/frontend-components-remediations';
import flatten from 'lodash/flatten';
import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import globalBackgroundColor100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_100';
import { AnsibeTowerIcon } from '@patternfly/react-icons';

class ComplianceRemediationButton extends React.Component {
    formatRule = ({ title, refId }, profile, system) => ({
        id: `ssg:rhel7|${profile.split('xccdf_org.ssgproject.')[1]}|${refId}`,
        description: title,
        systems: [
            system
        ]
    })

    uniqIssuesBySystem = (issues) => {
        const issueIds = issues.map((issue) => issue.id);
        return issues.filter((issue, index) => {
            const originalIssueIndex = issueIds.indexOf(issue.id);
            return (originalIssueIndex === index) ? true :
                (issues[originalIssueIndex].systems = Array.from(new Set(
                    issues[originalIssueIndex].systems.concat(issue.systems)))) && false;
        });
    }

    ruleProfile = (rule, system) => (
        system.profiles.find(profile => profile.rules.find(profileRule => rule.refId === profileRule.refId))
    )

    rulesWithRemediations = (rules, system) => {
        return rules.filter(rule => rule.remediationAvailable).map(
            rule => this.formatRule(rule, this.ruleProfile(rule, system).refId, system.id)
        );
    }

    dataProvider = () => {
        const { allSystems, selectedRules } = this.props;
        const result = { systems: [], issues: [] };
        allSystems.forEach(async (system) => {
            result.systems.push(system.id);
            if (selectedRules.length !== 0) {
                result.issues.push(this.rulesWithRemediations(selectedRules, system));
            } else {
                result.issues.push(this.rulesWithRemediations(system.ruleObjectsFailed, system));
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
    allSystems: propTypes.arrayOf(propTypes.shape({
        id: propTypes.string,
        name: propTypes.string,
        profiles: propTypes.arrayOf(propTypes.shape({
            refId: propTypes.string,
            name: propTypes.string,
            rules: propTypes.arrayOf(propTypes.shape({
                title: propTypes.string,
                severity: propTypes.string,
                rationale: propTypes.string,
                refId: propTypes.string,
                description: propTypes.string,
                compliant: propTypes.bool,
                identifier: propTypes.string,
                references: propTypes.string
            }))
        }))
    })),
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
