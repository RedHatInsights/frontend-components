import { defineMessages } from '@redhat-cloud-services/frontend-components-translations/localization';

export default defineMessages({
  actionsKebabDropdownToggle: {
    description: 'Accessible name for the three-dot menu that opens toolbar actions.',
    id: 'components.actions.kebabDropdownToggle',
    defaultMessage: 'kebab dropdown toggle',
  },
  appInfoLoading: {
    description: 'Accessible loading status while the remote inventory application information component loads.',
    id: 'components.appInfo.loading',
    defaultMessage: 'Loading',
  },
  bulkSelectSelectAll: {
    description: 'Accessible label for the bulk-selection checkbox that selects all available items.',
    id: 'components.bulkSelect.selectAll',
    defaultMessage: 'Select all',
  },
  bulkSelectSelectedCount: {
    description: 'Bulk-selection toggle summary. {count} is the number of selected items, formatted for the active locale.',
    id: 'components.bulkSelect.selectedCount',
    defaultMessage: '{count, number} selected',
  },
  checkboxFilterOptionsMenu: {
    description: 'Accessible name for the menu of checkbox filter choices.',
    id: 'components.checkboxFilter.optionsMenu',
    defaultMessage: 'Options menu',
  },
  conditionalFilterConditionalFiltersList: {
    description: 'Accessible name for the list of available filter categories.',
    id: 'components.conditionalFilter.conditionalFiltersList',
    defaultMessage: 'Conditional filters list',
  },
  conditionalFilterConditionalFilterToggle: {
    description: 'Accessible name for the toggle that opens the filter-category menu.',
    id: 'components.conditionalFilter.conditionalFilterToggle',
    defaultMessage: 'Conditional filter toggle',
  },
  conditionalFilterFilterBy: {
    description: 'Fallback filter input placeholder. {label} is the display label of the selected filter category.',
    id: 'components.conditionalFilter.filterBy',
    defaultMessage: 'Filter by {label}',
  },
  cullingInfoRemovalScheduled: {
    description: 'Inventory lifecycle tooltip warning of scheduled system removal. {count} is the number of days until removal.',
    id: 'components.cullingInfo.removalScheduled',
    defaultMessage: 'System scheduled for inventory removal in {count, number} days',
  },
  dateFormatInvalidDate: {
    description: 'Date display fallback when the supplied value cannot be parsed as a valid date.',
    id: 'components.dateFormat.invalidDate',
    defaultMessage: 'Invalid date',
  },
  dateFormatJustNow: {
    description: 'Relative time label for a timestamp within the most recent minute.',
    id: 'components.dateFormat.justNow',
    defaultMessage: 'Just now',
  },
  defaultErrorMessageSupport: {
    description:
      'Generic error recovery guidance. <support> wraps the Red Hat Support link; <status> wraps the service status link. Preserve both rich-text tags.',
    id: 'components.defaultErrorMessage.support',
    defaultMessage:
      'If the problem persists, contact <support>Red Hat Support</support> or check our <status> status page</status> for known outages.',
  },
  detailWrapperLoading: {
    description: 'Accessible loading status while the remote inventory detail wrapper component loads.',
    id: 'components.detailWrapper.loading',
    defaultMessage: 'Loading',
  },
  downloadButtonExport: {
    description: 'Accessible name for the data export dropdown toggle.',
    id: 'components.downloadButton.export',
    defaultMessage: 'Export',
  },
  downloadButtonExportCsv: {
    description: 'Export menu action that downloads data in CSV format. CSV is a file format acronym.',
    id: 'components.downloadButton.exportCsv',
    defaultMessage: 'Export to CSV',
  },
  downloadButtonExportJson: {
    description: 'Export menu action that downloads data in JSON format. JSON is a file format acronym.',
    id: 'components.downloadButton.exportJson',
    defaultMessage: 'Export to JSON',
  },
  downloadButtonTooltipText: {
    description: 'Tooltip explaining that the export control downloads the displayed data.',
    id: 'components.downloadButton.tooltipText',
    defaultMessage: 'Export data',
  },
  filterChipsDeleteTitle: {
    description: 'Label for removing a group of active filter chips and clearing its filters.',
    id: 'components.filterChips.deleteTitle',
    defaultMessage: 'Clear filters',
  },
  groupFilterClearInputValue: {
    description: 'Accessible name for the button that clears the grouped-filter search input.',
    id: 'components.groupFilter.clearInputValue',
    defaultMessage: 'Clear input value',
  },
  groupFilterGroupFilter: {
    description: 'Accessible name for the grouped-filter control and its options list.',
    id: 'components.groupFilter.groupFilter',
    defaultMessage: 'Group filter',
  },
  groupFilterInputWithDropdownAndClearButton: {
    description: 'Accessible name for a grouped-filter text input with a dropdown and a clear button.',
    id: 'components.groupFilter.inputWithDropdownAndClearButton',
    defaultMessage: 'input with dropdown and clear button',
  },
  inventoryDetailHeadLoading: {
    description: 'Accessible loading status while the remote inventory detail header component loads.',
    id: 'components.inventoryDetailHead.loading',
    defaultMessage: 'Loading',
  },
  inventoryDetailLoading: {
    description: 'Accessible loading status while the remote inventory detail component loads.',
    id: 'components.inventoryDetail.loading',
    defaultMessage: 'Loading',
  },
  inventoryLoadErrorFailedToLoad: {
    description: 'Inventory component loading error detail. {component} is the supplied component name, not a message ID.',
    id: 'components.inventoryLoadError.failedToLoad',
    defaultMessage: 'Failed to load {component}',
  },
  inventoryLoadErrorMoreInfoCanBeFoundInBrowserConsoleOutput: {
    description: 'Troubleshooting guidance beneath an inventory loading error; browser console means the browser developer console.',
    id: 'components.inventoryLoadError.moreInfoCanBeFoundInBrowserConsoleOutput',
    defaultMessage: 'More info can be found in browser console output.',
  },
  inventoryLoadErrorUnableToLoadInventoryComponent: {
    description: 'Heading for an error state when a remote inventory component cannot load.',
    id: 'components.inventoryLoadError.unableToLoadInventoryComponent',
    defaultMessage: 'Unable to load inventory component',
  },
  inventoryTableLoading: {
    description: 'Accessible loading status while the remote inventory table component loads.',
    id: 'components.inventoryTable.loading',
    defaultMessage: 'Loading',
  },
  maintenanceMaintenanceInProgress: {
    description: 'Heading of the empty state displayed during scheduled service maintenance.',
    id: 'components.maintenance.maintenanceInProgress',
    defaultMessage: 'Maintenance in progress',
  },
  maintenanceMoreInformation: {
    description: 'Maintenance status guidance. <status> wraps the link to status.redhat.com; keep the domain unchanged and preserve the tag.',
    id: 'components.maintenance.moreInformation',
    defaultMessage: 'For more information please visit <status>status.redhat.com</status>.',
  },
  maintenanceSchedule: {
    description:
      'Scheduled outage notice. <lead> and <schedule> wrap separate styled text sections. {utcStartTime}/{utcEndTime} are formatted UTC times; {startTime}/{endTime} are local times; {timeZone} is the local zone name. Preserve tags and placeholders.',
    id: 'components.maintenance.schedule',
    defaultMessage:
      '<lead>We are currently undergoing scheduled maintenance and will be</lead><schedule>unavailable from {utcStartTime} to {utcEndTime} UTC ({startTime}-{endTime} {timeZone}).</schedule>',
  },
  noRegisteredSystemsBodyText: {
    description: 'Empty-state guidance encouraging users with no registered systems to connect systems for security and compliance services.',
    id: 'components.noRegisteredSystems.bodyText',
    defaultMessage: 'Connect your systems to keep your Red Hat environment running efficiently, with security and compliance with various standards.',
  },
  noRegisteredSystemsButtonText: {
    description: 'Documentation link label in the empty state for an environment with no registered systems.',
    id: 'components.noRegisteredSystems.buttonText',
    defaultMessage: 'Learn more about connecting your systems',
  },
  noRegisteredSystemsTitleText: {
    description: 'Empty-state heading for an environment with no registered systems. Red Hat Enterprise Linux is a product name.',
    id: 'components.noRegisteredSystems.titleText',
    defaultMessage: 'Do more with your Red Hat Enterprise Linux environment',
  },
  notAuthorizedBody: {
    description: 'Permission-denied guidance. <access> wraps a link to the My User Access page; preserve the rich-text tag.',
    id: 'components.notAuthorized.body',
    defaultMessage:
      'Contact your organization administrator(s) for more information or visit <access>My User Access</access> to learn more about your permissions.',
  },
  notConnectedBodyText: {
    description: 'Empty-state instructions for a system that has not activated its Insights client.',
    id: 'components.notConnected.bodyText',
    defaultMessage: 'To get started, activate the Insights client for this system.',
  },
  notConnectedButtonText: {
    description: 'Documentation link label explaining how to activate the Insights client on a system.',
    id: 'components.notConnected.buttonText',
    defaultMessage: 'Learn how to activate the Insights client',
  },
  notConnectedTitleText: {
    description: 'Empty-state heading indicating that the current system is not connected to Red Hat Insights.',
    id: 'components.notConnected.titleText',
    defaultMessage: 'This system isn’t connected to Insights yet',
  },
  openSourceBadgeAboutOpenServices: {
    description: 'Accessible name for the badge that opens information about the service being open source.',
    id: 'components.openSourceBadge.aboutOpenServices',
    defaultMessage: 'About Open Services',
  },
  openSourceBadgeAboutOpenSource: {
    description: 'Heading of the popover explaining the open-source status of a service.',
    id: 'components.openSourceBadge.aboutOpenSource',
    defaultMessage: 'About open source',
  },
  openSourceBadgeRepositories: {
    description: 'Label introducing links to the source-code repositories in the open-source information popover.',
    id: 'components.openSourceBadge.repositories',
    defaultMessage: 'Repositories',
  },
  openSourceBadgeThisServiceIsOpenSourceSoAllOfItsCodeIsInspectable: {
    description: 'Open-source information popover body explaining that users can inspect and contribute to the service source code.',
    id: 'components.openSourceBadge.thisServiceIsOpenSourceSoAllOfItsCodeIsInspectable',
    defaultMessage: 'This service is open source, so all of its code is inspectable. Explore repositories to view and contribute to the source code.',
  },
  primaryToolbarCollapseAll: {
    description: 'Toolbar action that collapses all expandable table rows.',
    id: 'components.primaryToolbar.collapseAll',
    defaultMessage: 'Collapse all',
  },
  primaryToolbarExpandAll: {
    description: 'Toolbar action that expands all expandable table rows.',
    id: 'components.primaryToolbar.expandAll',
    defaultMessage: 'Expand all',
  },
  primaryToolbarSortAscending: {
    description: 'Ascending sort option in the toolbar sort-order menu. ASC denotes ascending order.',
    id: 'components.primaryToolbar.sortAscending',
    defaultMessage: 'Sort order ASC',
  },
  primaryToolbarSortDescending: {
    description: 'Descending sort option in the toolbar sort-order menu. DESC denotes descending order.',
    id: 'components.primaryToolbar.sortDescending',
    defaultMessage: 'Sort order DESC',
  },
  radioFilterOptionsMenu: {
    description: 'Accessible name for the menu of radio-button filter choices.',
    id: 'components.radioFilter.optionsMenu',
    defaultMessage: 'Options menu',
  },
  radioFilterSelectInput: {
    description: 'Accessible name for the radio-choice filter selection control.',
    id: 'components.radioFilter.selectInput',
    defaultMessage: 'Select Input',
  },
  rebootText: {
    description: 'Status text indicating that a system must be restarted for changes to take effect.',
    id: 'components.reboot.text',
    defaultMessage: 'Reboot required',
  },
  severityCritical: {
    description: 'Critical severity label used by severity indicators and security impact shields.',
    id: 'components.severity.critical',
    defaultMessage: 'Critical',
  },
  severityHigh: { description: 'High severity label used by severity indicators.', id: 'components.severity.high', defaultMessage: 'High' },
  severityImportant: {
    description: 'Important security severity label; a named rating distinct from Critical and Moderate.',
    id: 'components.severity.important',
    defaultMessage: 'Important',
  },
  severityLow: {
    description: 'Low severity label used by severity indicators and security impact shields.',
    id: 'components.severity.low',
    defaultMessage: 'Low',
  },
  severityMedium: { description: 'Medium severity label used by severity indicators.', id: 'components.severity.medium', defaultMessage: 'Medium' },
  severityModerate: {
    description: 'Moderate security severity label; a named rating between Important and Low.',
    id: 'components.severity.moderate',
    defaultMessage: 'Moderate',
  },
  severityUnknown: {
    description: 'Fallback severity label when a severity indicator has no recognized rating.',
    id: 'components.severity.unknown',
    defaultMessage: 'Unknown',
  },
  shieldCriticalDescription: {
    description: 'Security impact shield tooltip explaining the Critical vulnerability rating and its exploitability criteria.',
    id: 'components.shield.criticalDescription',
    defaultMessage:
      'This rating is given to flaws that could be easily exploited by a         remote unauthenticated attacker and lead to system compromise         (arbitrary code execution) without requiring user interaction. These         are the types of vulnerabilities that can be exploited by worms.         Flaws that require an authenticated remote user, a local user,         or an unlikely configuration are not classed as Critical impact.',
  },
  shieldImportantDescription: {
    description:
      'Security impact shield tooltip explaining the Important vulnerability rating and consequences for confidentiality, integrity or availability.',
    id: 'components.shield.importantDescription',
    defaultMessage:
      'This rating is given to flaws that can easily compromise the     confidentiality, integrity, or availability of resources. These are the     types of vulnerabilities that allow local users to gain privileges, allow     unauthenticated remote users to view resources that should otherwise be     protected by authentication, allow authenticated remote users to execute     arbitrary code, or allow remote users to cause a denial of service.',
  },
  shieldLowDescription: {
    description: 'Security impact shield tooltip explaining the Low vulnerability rating and limited exploitability or consequences.',
    id: 'components.shield.lowDescription',
    defaultMessage:
      'This rating is given to all other issues that have a security         impact. These are the types of vulnerabilities that are believed to         require unlikely circumstances to be able to be exploited, or where         a successful exploit would give minimal consequences.',
  },
  shieldModerateDescription: {
    description: 'Security impact shield tooltip explaining the Moderate vulnerability rating compared with Critical and Important ratings.',
    id: 'components.shield.moderateDescription',
    defaultMessage:
      'This rating is given to flaws that may be more difficult to exploit         but could still lead to some compromise of the confidentiality,         integrity, or availability of resources, under certain circumstances.         These are the types of vulnerabilities that could have had a Critical         impact or Important impact but are less easily exploited based on a         technical evaluation of the flaw, or affect unlikely configurations.',
  },
  shieldUnknownDescription: {
    description:
      'Security impact shield tooltip for the Unknown rating; current source explains that Red Hat products are not affected. Confirm the rating-to-explanation pairing during review.',
    id: 'components.shield.unknownDescription',
    defaultMessage: 'Red Hat Product Security has determined that this vulnerability does         not impact Red Hat products.',
  },
  simpleTableFilterButtonTitle: {
    description: 'Title of the control that applies the simple table text filter.',
    id: 'components.simpleTableFilter.buttonTitle',
    defaultMessage: 'Filter',
  },
  simpleTableFilterPlaceholder: {
    description: 'Default placeholder in the simple table filter input, inviting a search of table items.',
    id: 'components.simpleTableFilter.placeholder',
    defaultMessage: 'Search items',
  },
  simpleTableFilterSimpleTableFilter: {
    description: 'Accessible name for the simple table filtering control; this text is a user-facing label, not a technical identifier.',
    id: 'components.simpleTableFilter.simpleTableFilter',
    defaultMessage: 'simple-table-filter',
  },
  singleSelectFilterOptionsMenu: {
    description: 'Accessible name for the menu of single-selection filter choices.',
    id: 'components.singleSelectFilter.optionsMenu',
    defaultMessage: 'Options menu',
  },
  singleSelectFilterSelectInput: {
    description: 'Accessible name for the single-selection filter control.',
    id: 'components.singleSelectFilter.selectInput',
    defaultMessage: 'Select Input',
  },
  sortByAscending: {
    description: 'Accessible action label for changing the table sort direction to ascending.',
    id: 'components.sortBy.ascending',
    defaultMessage: 'Sort ascending',
  },
  sortByDescending: {
    description: 'Accessible action label for changing the table sort direction to descending.',
    id: 'components.sortBy.descending',
    defaultMessage: 'Sort descending',
  },
  spinnerLoadingText: {
    description: 'Default accessible status text for a spinner indicating that content is loading.',
    id: 'components.spinner.loadingText',
    defaultMessage: 'Loading...',
  },
  tableToolbarResultCount: {
    description: 'Table toolbar result summary. {count} is the number of matching results and controls plural wording and the localized number.',
    id: 'components.tableToolbar.resultCount',
    defaultMessage: '{count, plural, one {# Result} other {# Results}}',
  },
  tableToolbarSelectedCount: {
    description: 'Table toolbar selection summary. {count} is the localized number of selected rows.',
    id: 'components.tableToolbar.selectedCount',
    defaultMessage: '{count, number} Selected',
  },
  tableViewActionsColumnLabel: {
    description: 'Label for the row-actions column in a data table.',
    id: 'components.tableView.actionsColumnLabel',
    defaultMessage: 'Actions',
  },
  tableViewEmptyStateDefaultEmptyStateErrorBody: {
    description: 'Table loading-error empty-state body asking the user to try loading data again.',
    id: 'components.tableViewEmptyState.defaultEmptyStateErrorBody',
    defaultMessage: 'There was a problem loading the data. Please try again.',
  },
  tableViewEmptyStateDefaultEmptyStateErrorRetryText: {
    description: 'Action label for retrying a failed table data load.',
    id: 'components.tableViewEmptyState.defaultEmptyStateErrorRetryText',
    defaultMessage: 'Retry',
  },
  tableViewEmptyStateDefaultEmptyStateErrorTitle: {
    description: 'Heading shown when table data could not be loaded.',
    id: 'components.tableViewEmptyState.defaultEmptyStateErrorTitle',
    defaultMessage: 'Unable to load data',
  },
  tableViewEmptyStateDefaultEmptyStateNoDataBody: {
    description: 'Table empty-state body used when there is no data, independently of filtering.',
    id: 'components.tableViewEmptyState.defaultEmptyStateNoDataBody',
    defaultMessage: 'There is no data to display.',
  },
  tableViewEmptyStateDefaultEmptyStateNoDataTitle: {
    description: 'Table empty-state heading used when the data set is empty.',
    id: 'components.tableViewEmptyState.defaultEmptyStateNoDataTitle',
    defaultMessage: 'No data available',
  },
  tableViewEmptyStateDefaultEmptyStateNoResultsBody: {
    description: 'Filtered-table empty-state guidance explaining that no rows match and suggesting clearing filters.',
    id: 'components.tableViewEmptyState.defaultEmptyStateNoResultsBody',
    defaultMessage: 'No results match the filter criteria. Clear all filters to show results.',
  },
  tableViewEmptyStateDefaultEmptyStateNoResultsClearFiltersText: {
    description: 'Action label for clearing active table filters from the no-results empty state.',
    id: 'components.tableViewEmptyState.defaultEmptyStateNoResultsClearFiltersText',
    defaultMessage: 'Clear all filters',
  },
  tableViewEmptyStateDefaultEmptyStateNoResultsTitle: {
    description: 'Table empty-state heading shown when filtering produces no matching results.',
    id: 'components.tableViewEmptyState.defaultEmptyStateNoResultsTitle',
    defaultMessage: 'No results found',
  },
  tableViewEmptyStateError: {
    description: 'Prefix introducing a supplied error message in the table loading-error state.',
    id: 'components.tableViewEmptyState.error',
    defaultMessage: 'Error:',
  },
  tableViewEmptyStateTableViewEmptyStateActionsColumnLabel: {
    description: 'Actions-column label retained in the table header while an empty state is displayed.',
    id: 'components.tableViewEmptyState.tableViewEmptyStateActionsColumnLabel',
    defaultMessage: 'Actions',
  },
  tableViewEmptyStateTableViewEmptyStateAriaLabel: {
    description: 'Accessible name of the table structure containing an empty-state message.',
    id: 'components.tableViewEmptyState.tableViewEmptyStateAriaLabel',
    defaultMessage: 'Table',
  },
  tableViewEmptyStateTableViewEmptyStateSelectColumnLabel: {
    description: 'Selection-column label retained in the table header while an empty state is displayed.',
    id: 'components.tableViewEmptyState.tableViewEmptyStateSelectColumnLabel',
    defaultMessage: 'Select',
  },
  tableViewFiltersFilterBy: {
    description: 'Table filter input placeholder. {label} is the display name of the filter, supplied in lowercase by the caller.',
    id: 'components.tableViewFilters.filterBy',
    defaultMessage: 'Filter by {label}...',
  },
  tableViewFiltersSearch: {
    description: 'Default label for the table text-search filter when no custom placeholder is supplied.',
    id: 'components.tableViewFilters.search',
    defaultMessage: 'Search',
  },
  tableViewSelectColumnLabel: {
    description: 'Label for the column containing row-selection checkboxes in a data table.',
    id: 'components.tableView.selectColumnLabel',
    defaultMessage: 'Select',
  },
  tableViewToolbarIndeterminateRange: {
    description:
      'Pagination summary when the total number of items is unknown. {firstIndex}/{lastIndex} are visible item positions; <range> and <many> wrap styled text. Preserve tags and placeholders.',
    id: 'components.tableViewToolbar.indeterminateRange',
    defaultMessage: '<range>{firstIndex} - {lastIndex}</range> of <many>many</many>',
  },
  tableWithFilterNoEntities: {
    description: 'Tag-selection table empty-state heading. {entityName} is the supplied name of the entity type, such as tags.',
    id: 'components.tableWithFilter.noEntities',
    defaultMessage: 'No {entityName} found',
  },
  tableWithFilterNoMatches: {
    description:
      'Tag-selection table filtered-empty-state body. {entityName} names the entity type; <br></br> inserts a line break. Preserve the rich-text tag.',
    id: 'components.tableWithFilter.noMatches',
    defaultMessage: 'This filter criteria matches no {entityName}. <br></br> Try changing your filter settings.',
  },
  tableWithFilterSelectNone: {
    description: 'Bulk-selection menu action that deselects all rows; zero indicates the resulting selection count.',
    id: 'components.tableWithFilter.selectNone',
    defaultMessage: 'Select none (0)',
  },
  tableWithFilterSelectPage: {
    description: 'Bulk-selection menu action for the current page. {count} is the localized number of rows on that page.',
    id: 'components.tableWithFilter.selectPage',
    defaultMessage: 'Select page ({count, number})',
  },
  tableWithFilterTags: {
    description: 'Default plural entity name for the tag-selection table, inserted into its empty-state messages.',
    id: 'components.tableWithFilter.tags',
    defaultMessage: 'tags',
  },
  tagFilterApplicableToItems: {
    description: 'Tag option count tooltip. {count} is the number of items carrying the tag and controls plural wording and the localized number.',
    id: 'components.tagFilter.applicableToItems',
    defaultMessage: 'Applicable to {count, plural, one {# item} other {# items}}.',
  },
  tagFilterApplicableToNamedItems: {
    description:
      'Tag option count tooltip for a caller-named entity type. {count} is the localized quantity; {item} is the supplied entity noun with singular/plural wording already applied by code.',
    id: 'components.tagFilter.applicableToNamedItems',
    defaultMessage: 'Applicable to {count, number} {item}.',
  },
  tagFilterHookNoTagsAvailable: {
    description: 'Message displayed in the tag filter when no tag choices are available.',
    id: 'components.tagFilterHook.noTagsAvailable',
    defaultMessage: 'No tags available',
  },
  tagFilterMoreTags: {
    description: 'Tag filter expansion label. {count} is the number of additional tag options not currently shown.',
    id: 'components.tagFilter.moreTags',
    defaultMessage: '{count, number} more tags available',
  },
  tagModalAll: {
    description: 'Tag-selection modal tab label. {name} is the supplied group or entity name following the word All.',
    id: 'components.tagModal.all',
    defaultMessage: 'All {name}',
  },
  tagModalApplySelected: {
    description: 'Primary action in the tabbed tag-selection modal, confirming the selected entries.',
    id: 'components.tagModal.applySelected',
    defaultMessage: 'Apply selected',
  },
  tagModalApplyTags: {
    description: 'Primary action in the tag-selection modal, applying the selected tags.',
    id: 'components.tagModal.applyTags',
    defaultMessage: 'Apply tags',
  },
  tagModalCancel: {
    description: 'Secondary action that closes the tag-selection modal without applying changes.',
    id: 'components.tagModal.cancel',
    defaultMessage: 'Cancel',
  },
  tagModalName: { description: 'Column heading for tag names in the tag-selection modal.', id: 'components.tagModal.name', defaultMessage: 'Name' },
  tagModalTagsFor: {
    description: 'Tag-selection modal heading. {systemName} is the supplied system display name; do not translate the name itself.',
    id: 'components.tagModal.tagsFor',
    defaultMessage: 'Tags for {systemName}',
  },
  tagModalTagSource: {
    description: 'Column heading identifying where a tag originated in the tag-selection modal.',
    id: 'components.tagModal.tagSource',
    defaultMessage: 'Tag source',
  },
  textFilterInput: {
    description: 'Default accessible name for a text-based filter input.',
    id: 'components.textFilter.input',
    defaultMessage: 'text input',
  },
  truncateTruncateCollapseText: {
    description: 'Action that collapses expanded text back to its shortened preview.',
    id: 'components.truncate.truncateCollapseText',
    defaultMessage: 'Collapse',
  },
  truncateTruncateExpandText: {
    description: 'Action that expands a shortened text preview to show the full content.',
    id: 'components.truncate.truncateExpandText',
    defaultMessage: 'Read more',
  },
});
