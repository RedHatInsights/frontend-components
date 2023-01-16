import { severityLevels } from './items';

export default [
  {
    title: 'ID',
    sortByProperty: 'id',
    exportKey: 'id',
    key: 'id',
    managable: false,
  },
  {
    title: 'Name',
    key: 'id',
    sortByProperty: 'name',
    exportKey: 'name',
    renderFunc: (_a, _b, item) => item.name,
  },
  {
    title: 'Another Name column',
    key: 'another_name_column',
    sortByProperty: 'name',
    exportKey: 'name',
    renderExport: (name) => `${name} via export render`,
  },
  {
    title: 'Description',
    key: 'desc',
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
