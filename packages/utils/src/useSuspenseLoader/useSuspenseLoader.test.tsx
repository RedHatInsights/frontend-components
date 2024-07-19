import React, { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ErrorBoundaryPF from '@patternfly/react-component-groups/dist/dynamic/ErrorBoundary';
import useSuspenseLoader from './useSuspenseLoader';
import { act } from 'react-dom/test-utils';

const DummyComponent = ({ loader, funcArgs }: { funcArgs?: unknown[]; loader: ReturnType<typeof useSuspenseLoader>['loader'] }) => {
  const data = loader(funcArgs);
  return <div>{JSON.stringify(data)}</div>;
};

const CacheComponent = ({
  funcArgs,
  loaderFunc,
  afterResolve,
  afterReject,
}: {
  afterResolve?: (result: any) => void;
  afterReject?: (error: unknown) => void;
  loaderFunc: (...args: unknown[]) => Promise<unknown>;
  funcArgs?: unknown[];
}) => {
  const { loader, purgeCache } = useSuspenseLoader(loaderFunc, afterResolve, afterReject);
  return (
    <ErrorBoundaryPF headerTitle="Expected error">
      <Suspense fallback="Loading">
        <button onClick={purgeCache}>Purge Cache</button>
        <DummyComponent loader={loader} funcArgs={funcArgs} />
      </Suspense>
    </ErrorBoundaryPF>
  );
};

describe('useSuspenseLoader', () => {
  test('should call fetch data only once', async () => {
    const resp = 'data';
    const mockCall = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(resp), 100)));

    const { rerender } = render(<CacheComponent loaderFunc={mockCall} />);

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(await screen.findByText(JSON.stringify(resp))).toBeInTheDocument();
    // no additional async calls should happen on re-render with cached data
    rerender(<CacheComponent loaderFunc={mockCall} />);
    expect(await screen.findByText(JSON.stringify(resp))).toBeInTheDocument();
    expect(mockCall).toHaveBeenCalledTimes(1);
  });

  test('should call fetch data per cache key change', async () => {
    const props1 = 'props1';
    const props2 = 'props2';
    const props3 = 'props3';

    const currentProps = { curr: props1 };
    const mockCall = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(currentProps.curr), 100);
        })
    );

    const { rerender } = render(<CacheComponent loaderFunc={mockCall} funcArgs={[props1]} />);

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith([props1]);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(await screen.findByText(JSON.stringify(props1))).toBeInTheDocument();

    currentProps.curr = props2;
    rerender(<CacheComponent loaderFunc={mockCall} funcArgs={[props2]} />);
    expect(mockCall).toHaveBeenLastCalledWith([props2]);
    expect(await screen.findByText(JSON.stringify(props2))).toBeInTheDocument();

    currentProps.curr = props3;
    rerender(<CacheComponent loaderFunc={mockCall} funcArgs={[props3]} />);
    expect(mockCall).toHaveBeenLastCalledWith([props3]);
    expect(await screen.findByText(JSON.stringify(props3))).toBeInTheDocument();

    // again again for props1 but it should not trigger addtional call because the request is already in cache
    currentProps.curr = props1;
    rerender(<CacheComponent loaderFunc={mockCall} funcArgs={[props1]} />);
    expect(await screen.findByText(JSON.stringify(props1))).toBeInTheDocument();

    expect(mockCall).toHaveBeenCalledTimes(3);
  });

  test('should re-fetch data if cache is cleared', async () => {
    const currentResp = { curr: 'data' };
    const mockCall = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(currentResp.curr), 100)));

    render(<CacheComponent loaderFunc={mockCall} />);

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(await screen.findByText(JSON.stringify('data'))).toBeInTheDocument();
    // restart fetching after cache is cleared
    currentResp.curr = 'data-refreshed';
    act(() => {
      screen.getByText('Purge Cache').click();
    });
    expect(await screen.findByText(JSON.stringify('data-refreshed'))).toBeInTheDocument();
    expect(mockCall).toHaveBeenCalledTimes(2);
  });

  test('should call afterResolve argument on sucesfull fetch', async () => {
    const resp = 'data';
    const afterResolve = jest.fn();
    const mockCall = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(resp), 100)));

    render(<CacheComponent loaderFunc={mockCall} afterResolve={afterResolve} />);

    expect(await screen.findByText(JSON.stringify(resp))).toBeInTheDocument();
    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(afterResolve).toHaveBeenCalledTimes(1);
    expect(afterResolve).toHaveBeenCalledWith(resp);
  });

  test('should call afterReject argument on failed fetch', async () => {
    const error = 'error';
    const afterReject = jest.fn();
    const mockCall = jest.fn().mockRejectedValue(error);

    await waitFor(async () => {
      await render(<CacheComponent loaderFunc={mockCall} afterReject={afterReject} />);
    });

    expect(screen.queryByText(JSON.stringify(error))).not.toBeInTheDocument();

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(afterReject).toHaveBeenCalledTimes(1);
    expect(afterReject).toHaveBeenCalledWith(error);
    // error should bubble to error boundary
    expect(await screen.findByText('Expected error')).toBeInTheDocument();
  });
});
