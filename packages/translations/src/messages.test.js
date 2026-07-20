import messages from './messages';

const mockedMessages = {
  cancel: {
    id: 'default.cancel',
    description: 'Default cancel string',
    defaultMessage: 'Cancel',
  },
  save: {
    id: 'default.save',
    description: 'Default save string',
    defaultMessage: 'Save',
  },
};

describe('default messages', () => {
  Object.keys(mockedMessages).map((oneMsg) => {
    test(`${oneMsg}`, () => {
      expect(mockedMessages[oneMsg]).toEqual(messages[oneMsg]);
    });
  });
});
