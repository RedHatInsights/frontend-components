import usePromiseQueue from '../usePromiseQueue';

type FetchFunctionType = (filter: object | Array<string>, options?: object) => void;

//hook to enable fetching a lot of data from the API in concurrent API calls
const useFetchBatched = () => {
  const { isResolving: isLoading, resolve } = usePromiseQueue();

  return {
    isLoading,
    fetchBatched: (fetchFunction: FetchFunctionType, total: number, filter: object, batchSize = 50) => {
      const pages = Math.ceil(total / batchSize) || 1;

      const results = resolve([...new Array(pages)].map((_, pageIdx) => () => fetchFunction(filter, { page: pageIdx + 1, per_page: batchSize })));

      return results;
    },
    fetchBatchedInline: (fetchFunction: FetchFunctionType, list: Array<string>, batchSize = 20) => {
      const pages = Math.ceil(list.length / batchSize) || 1;

      const results = resolve(
        [...new Array(pages)].map((_, pageIdx) => () => fetchFunction(list.slice(batchSize * pageIdx, batchSize * (pageIdx + 1))))
      );

      return results;
    },
  };
};

export default useFetchBatched;
