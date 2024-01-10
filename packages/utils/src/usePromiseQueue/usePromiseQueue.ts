import { useCallback, useState } from 'react';
import pAll from 'p-all';

const DEFAULT_CONCURRENT_PROMISES = 2;

type PromiseQueueStateType = {
  isResolving: boolean;
  //undeterministic result type by p-all package
  promiseResults: any;
};

// hook that provides queued promises with state
const usePromiseQueue = (concurrency = DEFAULT_CONCURRENT_PROMISES) => {
  const defaultState: PromiseQueueStateType = {
    isResolving: false,
    promiseResults: undefined,
  };
  const [results, setResults] = useState(defaultState);

  const resolve = useCallback(
    async (fns: any) => {
      setResults((state) => ({
        ...state,
        isResolving: true,
      }));
      const results: any = await pAll(fns, {
        concurrency,
      });
      setResults({
        isResolving: false,
        promiseResults: results,
      });

      return results;
    },
    [concurrency]
  );

  return {
    isResolving: results.isResolving,
    results: results.promiseResults,
    resolve,
  };
};

export default usePromiseQueue;
