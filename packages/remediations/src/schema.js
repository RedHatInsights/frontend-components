import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

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
                    fields: []
                }
            ]
        }
    ]
});
