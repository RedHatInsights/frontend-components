import debounce from './debounce';

jest.useFakeTimers();

it('should be called once', async () => {
    const apiCall = jest.fn();
    const debounced = debounce(() => apiCall());
    debounced();
    expect(apiCall).toHaveBeenCalledTimes(0);

    [ ...new Array(5) ].forEach(() => {
        debounced();
    });
    jest.runAllTimers();
    expect(apiCall).toHaveBeenCalledTimes(1);
});

it('should be called twice', () => {
    const apiCall = jest.fn();
    const debounced = debounce(() => apiCall(), undefined, { leading: true });
    debounced();
    expect(apiCall).toHaveBeenCalledTimes(1);
    debounced();
    jest.runAllTimers();
    expect(apiCall).toHaveBeenCalledTimes(2);
});

it('accumulated', () => {
    const apiCall = jest.fn();
    const debounced = debounce(apiCall, undefined, { accumulate: true });
    debounced('first');
    expect(apiCall).toHaveBeenCalledTimes(0);
    debounced('second');
    jest.runAllTimers();
    expect(apiCall).toHaveBeenCalledTimes(1);
    expect(apiCall.mock.calls[0][0]).toEqual(expect.arrayContaining([ [ 'first' ], [ 'second' ] ]));
});
