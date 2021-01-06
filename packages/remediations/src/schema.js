import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

export default (container, issues) => ({
    fields: [
        {
            component: componentTypes.WIZARD,
            name: 'wizzard',
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
                        name: 'select-playbook',
                        component: 'select-playbook',
                        validate: [{
                            type: validatorTypes.PATTERN,
                            pattern: /^$|^.*[\w\d]+.*$/
                        },
                        {
                            type: validatorTypes.REQUIRED
                        }]
                    }],
                    nextStep: ({ values }) => values.multiple ? 'actions' : 'review'
                },
                {
                    name: 'actions',
                    title: 'Review and edit actions',
                    fields: [{
                        name: 'manual-resolution',
                        component: 'review-actions'
                    }],
                    nextStep: ({ values }) => values['manual-resolution'] ? 'issue-resolution-0' : 'review'
                },
                ...issues.map((issue, index) => (
                    {
                        name: `issue-resolution-${index}`,
                        title: issue.action,
                        showTitle: false,
                        fields: [
                            {
                                name: `issue-resolution-${index}`,
                                component: 'issue-resolution',
                                issue
                            }
                        ],
                        nextStep: index < issues.length ? `issue-resolution-${index + 1}` : 'review',
                        substepOf: 'Choose actions'
                    }
                )),
                {
                    name: 'review',
                    title: 'Remediation review',
                    fields: [{
                        name: 'issue-resolution-review',
                        component: 'select-playbook'
                    }]
                }

            ]
        }
    ]
});
