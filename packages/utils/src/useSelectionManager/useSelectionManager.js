import { useReducer } from 'react';
import reducer, { init as initReducer } from './reducer';

const useSelectionManager = (preselected, options = {}) => {
  const { withGroups = false } = options;
  const [selection, dispatch] = useReducer(reducer, preselected, initReducer(withGroups));

  const set = (items, group) => dispatch({ type: 'set', group, items });

  const select = (item, group, useSet = false) => (useSet ? set(item, group) : dispatch({ type: 'select', group, item }));

  const deselect = (item, group, useSet = false) => (useSet ? set(item, group) : dispatch({ type: 'deselect', group, item }));

  const toggle = (item, group) => dispatch({ type: 'toggle', group, item });

  const reset = () => dispatch({ type: 'reset', preselected });

  const clear = () => dispatch({ type: 'clear' });

  return {
    set,
    select,
    deselect,
    toggle,
    reset,
    clear,
    selection: withGroups ? selection : selection.default,
  };
};

export default useSelectionManager;
