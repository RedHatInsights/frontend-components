import isObject from 'lodash/isObject';
import uniq from 'lodash/uniq';

const selectionGroup = (action) => action.group || 'default';

export const init = (withGroups) => (preselected) => withGroups ? preselected || {} : { default: preselected || [] };

const cleanEmpty = (state) => {
  const newState = state;
  Object.entries(state).forEach(([key, value]) => {
    if (value === undefined) {
      delete newState[key];
    }
  });
  return newState;
};

const set = (state = {}, action) => {
  const group = selectionGroup(action);

  return cleanEmpty({
    ...state,
    [group]: action.items?.length > 0 || isObject(action.items) ? action.items : undefined,
  });
};

const select = (state = {}, action) => {
  const group = selectionGroup(action);
  return cleanEmpty({
    ...state,
    [group]: action.reset ? action?.items : uniq([action?.item, ...(state[group] || [])]),
  });
};

const deselect = (state = {}, action) => {
  const group = selectionGroup(action);
  const items = (state[group] || []).filter((selectedItem) => selectedItem !== action?.item);

  return cleanEmpty({
    ...state,
    [group]: items.length === 0 ? undefined : items,
  });
};

const toggle = (state, action) => {
  const group = selectionGroup(action);
  return (state[group] || []).includes(action.item) ? deselect(state, action) : select(state, action);
};

const reset = (state, action) => init(!state.hasOwnProperty('default'))(action?.preselected);
const clear = (state) => init(!state.hasOwnProperty('default'))();

export default (state, action) =>
  ({
    set,
    select,
    deselect,
    toggle,
    reset,
    clear,
  }[action.type](state, action));
