import debounce from './debounce';

describe('debounce', () => {
  jest.useFakeTimers();
  it('should be called once', async () => {
    const apiCall = jest.fn();
    const debounced = debounce(() => apiCall());
    debounced();
    expect(apiCall).toHaveBeenCalledTimes(0);

    [...new Array(5)].forEach(() => {
      debounced();
    });
    await jest.runAllTimers();
    expect(apiCall).toHaveBeenCalledTimes(1);
  });

  it('should be called twice', async () => {
    const apiCall = jest.fn();
    const debounced = debounce(() => apiCall(), undefined, { leading: true });
    debounced();
    expect(apiCall).toHaveBeenCalledTimes(1);
    debounced();
    await jest.runAllTimers();
    expect(apiCall).toHaveBeenCalledTimes(2);
  });

  it('accumulated', async () => {
    const apiCall = jest.fn().mockResolvedValue(true);
    const debounced = debounce(apiCall, undefined, { accumulate: true });
    debounced('first');
    expect(apiCall).toHaveBeenCalledTimes(0);
    debounced('second');
    await jest.runAllTimers();
    expect(apiCall).toHaveBeenCalledTimes(1);
    expect(apiCall.mock.calls[0][0]).toEqual(expect.arrayContaining([['first'], ['second']]));
  });
});
