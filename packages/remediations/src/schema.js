
export default (container) => ({
    fields: [
        {
            component: 'wizard',
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
