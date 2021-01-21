import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/esm/validator-types';
import {
    HAS_MULTIPLES,
    SELECT_PLAYBOOK,
    MANUAL_RESOLUTION,
    EXISTING_PLAYBOOK,
    EXISTING_PLAYBOOK_SELECTED
} from './utils';

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
                    fields: [{
                        name: SELECT_PLAYBOOK,
                        component: 'select-playbook',
                        validate: [{
                            type: validatorTypes.PATTERN,
                            pattern: /^$|^.*[\w\d]+.*$/
                        },
                        {
                            type: validatorTypes.REQUIRED
                        }]
                    }],
                    nextStep: ({ values }) => values[HAS_MULTIPLES] ? 'actions' : 'review'
                },
                {
                    name: 'actions',
                    title: 'Review and edit actions',
                    fields: [{
                        name: MANUAL_RESOLUTION,
                        component: 'review-actions'
                    }],
                    nextStep: ({ values }) => {
                        const filteredIssues = values[EXISTING_PLAYBOOK_SELECTED]
                            ? issues.filter(issue => !values[EXISTING_PLAYBOOK].issues.some(i => i.id === issue.id))
                            : issues;
                        return values[MANUAL_RESOLUTION] ? filteredIssues[0].id : 'review';
                    }
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
                            }
                        ],
                        nextStep: ({ values }) => {
                            const filteredIssues = values[EXISTING_PLAYBOOK_SELECTED]
                                ? issues.filter(issue => !values[EXISTING_PLAYBOOK].issues.some(i => i.id === issue.id))
                                : issues;
                            return filteredIssues.slice(filteredIssues.findIndex(i => i.id === issue.id) + 1, filteredIssues.length)[0]?.id || 'review';
                        },
                        substepOf: 'Choose actions'
                    }
                )),
                {
                    name: 'review',
                    title: 'Remediation review',
                    fields: [
                        {
                            name: 'review',
                            component: 'review'
                        }
                    ]
                }

            ]
        }
    ]
});
