import React from 'react';
import propTypes from 'prop-types';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import flatten from 'lodash/flatten';
import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

class ComplianceRemediationButton extends React.Component {
    constructor(props) {
        super(props);
    }

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

    removeRefIdPrefix = (refId) => {
        const splitRefId = refId.toLowerCase().split('xccdf_org.ssgproject.content_profile_')[1];
        if (splitRefId) {
            return splitRefId;
        } else {
            // Sometimes the reports contain IDs like "stig-rhel7-disa" which we can pass
            // directly
            return refId;
        }
    }

    rulesWithRemediations = (rules, systemId) => {
        return window.insights.chrome.auth.getUser()
        .then(() => {
            return fetch('/api/remediations/v1/resolutions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; chartset=utf-8' },
                body: JSON.stringify({
                    issues: rules.map(rule => `ssg:rhel7|` +
                                      `${this.removeRefIdPrefix(rule.profiles[0].refId)}|` +
                                      `${rule.refId}`)
                })
            }).then((response) => {
                if (!response.ok) {
                    // If remediations doesn't respond, inject no fix available
                    return {};
                }

                return response.json();
            }).then(response => Object.keys(response).filter(rule => response[rule]).map(
                ruleRefId => this.formatRule(this.findRule(rules, ruleRefId), ruleRefId.split('|')[1], systemId)
            ));
        });
    }

    dataProvider = () => {
        const { allSystems, selectedRules } = this.props;
        const result = { systems: [], issues: []};
        allSystems.forEach(async (system) => {
            result.systems.push(system.id);
            if (selectedRules) {
                result.issues.push(this.rulesWithRemediations(selectedRules, system.id));
            } else {
                result.issues.push(this.rulesWithRemediations(system.rule_objects_failed, system.id));
            }
        });

        return Promise.all(result.issues).then(issues => {
            result.issues = this.uniqIssuesBySystem(flatten(issues));
            return result;
        });
    }

    render() {
        const { addNotification, allSystems, selectedRules } = this.props;

        return (
            <React.Fragment>
                <RemediationButton
                    isDisabled={ (allSystems.length === 0 || allSystems[0].rule_objects_failed.length === 0) &&
                        selectedRules.length === 0
                    }
                    onRemediationCreated={ result => addNotification(result.getNotification()) }
                    dataProvider={ this.dataProvider }
                />
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
