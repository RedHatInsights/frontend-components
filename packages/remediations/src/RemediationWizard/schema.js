import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/esm/validator-types';
import {
    HAS_MULTIPLES,
    SELECT_PLAYBOOK,
    MANUAL_RESOLUTION,
    EXISTING_PLAYBOOK,
    EXISTING_PLAYBOOK_SELECTED,
    SELECTED_RESOLUTIONS,
    AUTO_REBOOT
} from '../utils';

export const selectPlaybookFields = [{
    name: SELECT_PLAYBOOK,
    component: 'select-playbook',
    validate: [{
        type: validatorTypes.PATTERN,
        pattern: /^$|^.*[\w\d]+.*$/
    },
    {
        type: validatorTypes.REQUIRED
    }]
},
{
    name: EXISTING_PLAYBOOK_SELECTED,
    component: componentTypes.TEXT_FIELD,
    hideField: true
},
{
    name: EXISTING_PLAYBOOK,
    component: componentTypes.TEXT_FIELD,
    hideField: true
}];

export const reviewActionsFields = [{
    name: MANUAL_RESOLUTION,
    component: 'review-actions'
}];

export const reviewActionsNextStep = (values, issues) => {
    const filteredIssues = values[EXISTING_PLAYBOOK_SELECTED]
        ? issues.filter(issue => !values[EXISTING_PLAYBOOK].issues.some(i => i.id === issue.id))
        : issues;
    return values[MANUAL_RESOLUTION] ? filteredIssues[0].id : 'review';
};

export const issueResolutionNextStep = (values, issues, issue) => {
    const filteredIssues = values[EXISTING_PLAYBOOK_SELECTED]
        ? issues.filter(issue => !values[EXISTING_PLAYBOOK].issues.some(i => i.id === issue.id))
        : issues;
    return filteredIssues.slice(filteredIssues.findIndex(i => i.id === issue.id) + 1, filteredIssues.length)[0]?.id || 'review';
};

export default issues => ({
    fields: [
        {
            component: componentTypes.WIZARD,
            name: 'remediations-wizard',
            isDynamic: true,
            inModal: true,
            showTitles: true,
            title: 'Remediate with Ansible',
            description: 'Add issues to an Ansible Playbook',
            fields: [
                {
                    name: 'playbook',
                    title: 'Select playbook',
                    fields: selectPlaybookFields,
                    nextStep: 'systems'
                },
                {
                    name: 'systems',
                    title: 'Review systems',
                    fields: [{
                        name: 'review-systems',
                        component: 'review-systems'
                    }],
                    nextStep: ({ values }) => values[HAS_MULTIPLES] ? 'actions' : 'review'
                },
                {
                    name: 'actions',
                    title: 'Review and edit actions',
                    fields: reviewActionsFields,
                    nextStep: ({ values }) => reviewActionsNextStep(values, issues)
                },
                ...issues.map(issue => (
                    {
                        name: issue.id,
                        title: issue.shortId,
                        showTitle: false,
                        fields: [
                            {
                                name: issue.id,
                                component: 'issue-resolution',
                                issue
                            },
                            {
                                name: SELECTED_RESOLUTIONS,
                                component: componentTypes.TEXT_FIELD,
                                hideField: true
                            }
                        ],
                        nextStep: ({ values }) => issueResolutionNextStep(values, issues, issue),
                        substepOf: 'Choose actions'
                    }
                )),
                {
                    name: 'review',
                    title: 'Remediation review',
                    fields: [
                        {
                            name: AUTO_REBOOT,
                            component: 'review'
                        }
                    ]
                }

            ]
        }
    ]
});
