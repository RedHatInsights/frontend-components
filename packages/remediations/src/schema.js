import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

export default (container) => ({
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
                    }]
                }
            ]
        }
    ]
});
