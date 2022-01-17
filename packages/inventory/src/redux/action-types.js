const makeActions = (actions) => {
  return actions?.reduce?.(
    (acc, curr) => ({
      ...acc,
      [curr]: curr,
      [`${curr}_PENDING`]: `${curr}_PENDING`,
      [`${curr}_FULFILLED`]: `${curr}_FULFILLED`,
      [`${curr}_REJECTED`]: `${curr}_REJECTED`,
    }),
    {}
  );
};

const asyncInventory = [
  'LOAD_ENTITIES',
  'LOAD_ENTITY',
  'REMOVE_ENTITY',
  'LOAD_SYSTEM_PROFILE',
  'SET_DISPLAY_NAME',
  'SET_ANSIBLE_HOST',
  'LOAD_TAGS',
  'ALL_TAGS',
];

const systemIssues = ['LOAD_ADVISOR_RECOMMENDATIONS', 'LOAD_APPLICABLE_CVES', 'LOAD_APPLICABLE_ADVISORIES', 'LOAD_COMPLIANCE_POLICIES'];

export const INVENTORY_ACTION_TYPES = makeActions(asyncInventory);
export const ACTION_TYPES = INVENTORY_ACTION_TYPES;

export const SYSTEM_ISSUE_TYPES = makeActions(systemIssues);

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';
export const SELECT_ENTITY = 'SELECT_ENTITY';
export const CHANGE_SORT = 'CHANGE_SORT';
export const FILTER_ENTITIES = 'FILTER_ENTITIES';
export const APPLICATION_SELECTED = 'APPLICATION_SELECTED';
export const SHOW_ENTITIES = 'SHOW_ENTITIES';
export const FILTER_SELECT = 'FILTER_SELECT';
export const ENTITIES_LOADING = 'ENTITIES_LOADING';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const TOGGLE_TAG_MODAL = 'TOGGLE_TAG_MODAL';
export const CONFIG_CHANGED = 'CONFIG_CHANGED';
export const TOGGLE_DRAWER = 'TOGGLE_INVENTORY_DRAWER';
