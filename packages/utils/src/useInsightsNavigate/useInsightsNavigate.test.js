import { renderHook } from '@testing-library/react';
import useInsightsNavigate from './useInsightsNavigate';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe.skip('useInsightsNavigate', () => {
  /**
   * The useAxiosWithPlatformInterceptors has a circular dependency with the useChrome hook.
   * The frontend components package depends on the utils package and utils package would depends on the frontend components package.
   * Disabling this test for now.
   */
  it('should return a function', () => {
    useNavigate.mockImplementation(() => undefined);
    const { result } = renderHook(() => useInsightsNavigate());

    expect(typeof result.current).toEqual('function');
  });

  it('should work', () => {
    const navigateMock = jest.fn();
    useNavigate.mockImplementation(() => navigateMock);
    const { result } = renderHook(() => useInsightsNavigate());

    result.current('/path');

    expect(navigateMock).toHaveBeenCalled();
  });
});
