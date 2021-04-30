import { severityLevels } from './items';

export default [
    {
        title: 'Name',
        key: 'name',
        sortByProperty: 'name',
        renderFunc: (item) => (
            item.name
        )
    }, {
        title: 'Description',
        key: 'description'
    }, {
        title: 'Severity sorted by function',
        sortByFunction: (item) => (severityLevels.indexOf(item.severity)),
        renderFunc: (item) => (
            item.severity
        )
    }, {
        title: 'Severity by Array',
        sortByProperty: 'severity',
        sortByArray: severityLevels,
        renderFunc: (item) => (
            item.severity
        )
    }
];
