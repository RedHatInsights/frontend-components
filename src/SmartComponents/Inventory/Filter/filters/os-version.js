const version7 = [ '6', '5', '4', '3', '2', '1', '0 GA', '0 Beta' ];
const version6 = [ '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0' ];
const version5 = [ '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0' ];
const version4 = [ '9', '8', '7', '6', '5', '4', '3', '2', '1', 'GA' ];
const version3 = [ '9', '8', '7', '6', '5', '4', '3', '2', '1', 'GA' ];
const version2 = [ '7', '6', '5', '4', '3', '2', '1', 'GA' ];

export default ({
    title: 'OS version',
    value: 'os-version',
    items: [
        {
            title: 'RHEL 7',
            value: 'rhel-7',
            selected: true,
            items: version7.map(version => ({
                title: `7.${version}`,
                value: `7.${version}`.replace(/[.\s]+/g, '-').toLowerCase()
            }))
        },
        {
            title: 'RHEL 6',
            value: 'rhel-6',
            items: version6.map(version => ({
                title: `6.${version}`,
                value: `6.${version}`.replace(/[.\s]+/g, '-').toLowerCase()
            }))
        },
        {
            title: 'RHEL 5',
            value: 'rhel-5',
            items: version5.map(version => ({
                title: `5.${version}`,
                value: `5.${version}`.replace(/[.\s]+/g, '-').toLowerCase()
            }))
        },
        {
            title: 'RHEL 4',
            value: 'rhel-4',
            items: version4.map(version => ({
                title: `Update ${version}`,
                value: `4 Update ${version}`.replace(/[.\s]+/g, '-').toLowerCase()
            }))
        },
        {
            title: 'RHEL 3',
            value: 'rhel-3',
            items: version3.map(version => ({
                title: `Update ${version}`,
                value: `3 Update ${version}`.replace(/[.\s]+/g, '-').toLowerCase()
            }))
        },
        {
            title: 'RHEL 2.1',
            value: 'rhel-2-1',
            items: version2.map(version => ({
                title: `Update ${version}`,
                value: `2 Update ${version}`.replace(/[.\s]+/g, '-').toLowerCase()
            }))
        }
    ]
});
