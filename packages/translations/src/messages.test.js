import messages from './messages';

const mockedMessages = {
    cancel: {
        id: 'default.cancel',
        defaultMessage: 'Cancel'
    },
    save: {
        id: 'default.save',
        defaultMessage: 'Save'
    }
};

describe('default messages', () => {
    Object.keys(mockedMessages).map(oneMsg => {
        test(`${oneMsg}`, () => {
            expect(mockedMessages[oneMsg]).toEqual(messages[oneMsg]);
        });
    });
});
