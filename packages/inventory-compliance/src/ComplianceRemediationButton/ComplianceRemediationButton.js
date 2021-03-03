import React from 'react';
import propTypes from 'prop-types';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import flatten from 'lodash/flatten';
import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { AnsibeTowerIcon } from '@patternfly/react-icons';

class ComplianceRemediationButton extends React.Component {
    formatRule = ({ title, refId }, profile, system, majorOsVersion) => ({
        id: `ssg:rhel${majorOsVersion}|${profile.split('xccdf_org.ssgproject.')[1]}|${refId}`,
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
        return rules.filter((rule) => (
            rule.remediationAvailable &&
            this.ruleProfile(rule, system).supported &&
            rule.compliant === false
        )).map((rule) => {
            const profile = this.ruleProfile(rule, system);
            return this.formatRule(
                rule, profile.refId, system.id, profile.majorOsVersion
            );
        });
    }

    dataProvider = () => {
        const { allSystems, selectedRules } = this.props;
        const result = { systems: [], issues: [] };

        allSystems.filter((system) => (system.supported)).forEach(async (system) => {
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

    notEmptyData = async () => {
        const data = await this.dataProvider();
        return data.issues.length > 0 && data.systems.length > 0;
    }

    remediationAvailable = () => {
        const { allSystems, selectedRules } = this.props;
        let rules = selectedRules.length ? selectedRules : allSystems.flatMap((system) => system.ruleObjectsFailed);

        return rules.some((rule) => (
            rule.remediationAvailable &&
            (
                rule.profiles?.some((profile) => profile.supported) ||
                allSystems.some((system) => this.ruleProfile(rule, system).supported)
            ) &&
            rule.compliant === false
        ));
    }

    render() {
        const { addNotification } = this.props;

        return (
            <React.Fragment>
                <RemediationButton
                    isDisabled={ !(this.remediationAvailable() && this.notEmptyData()) }
                    onRemediationCreated={ result => addNotification(result.getNotification()) }
                    dataProvider={ this.dataProvider }>
                    <AnsibeTowerIcon size='sm' color='var(--pf-c-button--m-primary--Color)' />
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
        supported: propTypes.bool.isRequired,
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
