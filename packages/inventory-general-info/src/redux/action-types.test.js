import { ACTION_TYPES } from './action-types';

const asyncTypes = ['', '_PENDING', '_FULFILLED', '_REJECTED'];

asyncTypes.map((type) => {
  it(`LOAD_SYSTEM_PROFILE${type} should be defined`, () => {
    expect(ACTION_TYPES[`LOAD_SYSTEM_PROFILE${type}`]).toBeDefined();
  });
});
