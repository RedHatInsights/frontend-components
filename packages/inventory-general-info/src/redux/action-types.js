const asyncInventory = ['LOAD_SYSTEM_PROFILE'].reduce(
  (acc, curr) => [...acc, ...[curr, `${curr}_PENDING`, `${curr}_FULFILLED`, `${curr}_REJECTED`]],
  []
);

export const ACTION_TYPES = [...asyncInventory].reduce(
  (acc, curr) => {
    acc[curr] = curr;
    return acc;
  },
  {
    SET_DISPLAY_NAME: 'SET_DISPLAY_NAME',
    SET_ANSIBLE_HOST: 'SET_ANSIBLE_HOST',
  }
);
