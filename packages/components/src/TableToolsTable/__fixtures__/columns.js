import { severityLevels } from './items';

export default [
  {
    title: 'ID',
    sortByProperty: 'id',
    exportKey: 'id',
  },
  {
    title: 'Name',
    sortByProperty: 'name',
    exportKey: 'name',
    renderFunc: (_a, _b, item) => item.name,
  },
  {
    title: 'Another Name column',
    sortByProperty: 'name',
    exportKey: 'name',
    renderExport: (name) => `${name} via export render`,
  },
  {
    title: 'Description',
    sortByProperty: 'description',
    renderExport: (item) => `${item.name} description rendered for export`,
  },
  {
    title: 'Severity sorted by function',
    sortByFunction: (item) => item.name,
    exportKey: 'severity',
    renderFunc: (_a, _b, item) => item.severity,
  },
  {
    title: 'Severity by Array',
    sortByProperty: 'severity',
    sortByArray: severityLevels,
    exportKey: 'severity',
    renderFunc: (_a, _b, item) => item.severity,
  },
];
