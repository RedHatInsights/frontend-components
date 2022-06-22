import { ChromeAPI } from '@redhat-cloud-services/types';
import { useScalprum } from '@scalprum/react-core';

export type UseChromeSelector<T = any> = (chromeState: ChromeAPI) => T;

const useChrome = <T = ChromeAPI>(selector?: UseChromeSelector<T>): ChromeAPI | T => {
  const state = useScalprum<{ initialized: boolean; api: { chrome: ChromeAPI } }>();
  let chrome: ChromeAPI = state.api?.chrome || {};
  chrome = {
    ...chrome,
    initialized: state.initialized,
  };
  if (typeof selector === 'function') {
    return selector(chrome);
  }

  return chrome;
};

export default useChrome;
