import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/esm/validator-types';
import {
    HAS_MULTIPLES,
    SELECT_PLAYBOOK,
    MANUAL_RESOLUTION
} from './utils';

export default (container, issues) => ({
    fields: [
        {
            component: componentTypes.WIZARD,
            name: 'remediations-wizard',
            isDynamic: true,
            inModal: true,
            showTitles: true,
            title: 'Remediate with Ansible',
            description: 'Add issues to an Ansible Playbook',
            container,
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
                    nextStep: ({ values }) => values[MANUAL_RESOLUTION] ? 'issue-resolution-0' : 'review'
                },
                ...issues.map((issue, index) => (
                    {
                        name: `issue-resolution-${index}`,
                        title: issue.shortId,
                        showTitle: false,
                        fields: [
                            {
                                name: `issue-resolution-${index}`,
                                component: 'issue-resolution',
                                issue
                            }
                        ],
                        nextStep: index < issues.length - 1 ? `issue-resolution-${index + 1}` : 'review',
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
