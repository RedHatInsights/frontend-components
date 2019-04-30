import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import RemediationButton from '../../../Remediations/RemediationButton';
import flatten from 'lodash/flatten';

class ComplianceRemediationButton extends React.Component {
    constructor(props) {
        super(props);
    }

    /* eslint-disable camelcase */
    formatRule = ({ title, ref_id }, profile, system) => ({
        id: `ssg:rhel7|${profile}|${ref_id}`,
        description: title,
        systems: [
            system
        ]
    })

    findRule = (rules, ref_id) => {
        return rules.find(rule => rule.ref_id === ref_id.split('|')[2]);
    }

    uniqIssuesBySystem = (issues) => {
        const issueIds = issues.map((issue) => issue.id);
        return issues.filter((issue, index) => {
            const originalIssueIndex = issueIds.indexOf(issue.id);
            return (originalIssueIndex === index) ? true :
                (issues[originalIssueIndex].systems = issues[originalIssueIndex].systems.concat(issue.systems)) && false;
        });
    }

    removeRefIdPrefix = (ref_id) => {
        return ref_id.split('xccdf_org.ssgproject.content_profile_')[1];
    }

    rulesWithRemediations = (rules, system_id) => {
        return window.insights.chrome.auth.getUser()
        .then(() => {
            return fetch('/api/remediations/v1/resolutions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; chartset=utf-8' },
                body: JSON.stringify({
                    issues: rules.map(rule => `ssg:rhel7|` +
                                      `${this.removeRefIdPrefix(rule.profiles[0].ref_id)}|` +
                                      `${rule.ref_id}`)
                })
            }).then((response) => {
                if (!response.ok) {
                    // If remediations doesn't respond, inject no fix available
                    return {};
                }

                return response.json();
            }).then(response => Object.keys(response).filter(rule => response[rule]).map(
                rule_ref_id => this.formatRule(this.findRule(rules, rule_ref_id), rule_ref_id.split('|')[1], system_id)
            ));
        });
    }

    dataProvider = () => {
        const { allSystems, selectedRules } = this.props;
        const result = { systems: [], issues: []};
        allSystems.forEach(async (system) => {
            result.systems.push(system.id);
            if (selectedRules) {
                result.issues.push(selectedRules.map(rule => this.formatRule(rule, this.removeRefIdPrefix(rule.profile), system.id)));
            } else {
                result.issues.push(this.rulesWithRemediations(system.rule_objects_failed, system.id));
            }
        });

        return Promise.all(result.issues).then(issues => {
            result.issues = this.uniqIssuesBySystem(flatten(issues));
            return result;
        });
    }
    /* eslint-enable camelcase */

    render() {
        const { allSystems, selectedRules } = this.props;

        return (
            <React.Fragment>
                <RemediationButton
                    isDisabled={ (allSystems.length === 0 || allSystems[0].rule_objects_failed.length === 0) &&
                        selectedRules.length === 0
                    }
                    dataProvider={ this.dataProvider }
                />
            </React.Fragment>
        );
    }
}

ComplianceRemediationButton.propTypes = {
    selectedRules: propTypes.array,
    allSystems: propTypes.array // Prop coming from data.allSystems GraphQL query
};

ComplianceRemediationButton.defaultProps = {
    allSystems: []
};

export default ComplianceRemediationButton;
