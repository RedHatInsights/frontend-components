import { renderHook } from '@testing-library/react';
import { useOuia } from './index';

describe('useOuia', () => {
  it('Has the component-type', () => {
    const { result } = renderHook(() =>
      useOuia({
        type: 'Helper',
      })
    );
    expect(result.current).toHaveProperty('data-ouia-component-type', 'Helper');
  });

  it('Appends module if set', () => {
    const { result } = renderHook(() =>
      useOuia({
        type: 'Helper',
        module: 'MyLib',
      })
    );
    expect(result.current).toHaveProperty('data-ouia-component-type', 'MyLib/Helper');
  });

  it('Set ouia-safe to true if undefined', () => {
    const { result } = renderHook(() =>
      useOuia({
        type: 'Helper',
      })
    );
    expect(result.current).toHaveProperty('data-ouia-safe', true);
  });

  it('Set ouia-safe to true if set to true', () => {
    const { result } = renderHook(() =>
      useOuia({
        type: 'Helper',
        ouiaSafe: true,
      })
    );
    expect(result.current).toHaveProperty('data-ouia-safe', true);
  });

  it('Set ouia-safe to false if set to false', () => {
    const { result } = renderHook(() =>
      useOuia({
        type: 'Helper',
        ouiaSafe: false,
      })
    );
    expect(result.current).toHaveProperty('data-ouia-safe', false);
  });

  it('component-id is not set if undefined', () => {
    const { result } = renderHook(() =>
      useOuia({
        type: 'Helper',
      })
    );
    expect(result.current).not.toHaveProperty('data-ouia-component-id');
  });

  it('component-id is set when defined', () => {
    const { result } = renderHook(() =>
      useOuia({
        type: 'Helper',
        ouiaId: 'foobar',
      })
    );
    expect(result.current).toHaveProperty('data-ouia-component-id', 'foobar');
  });
});
