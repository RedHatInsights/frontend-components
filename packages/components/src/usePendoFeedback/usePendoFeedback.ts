import { ChromeAPI } from '@redhat-cloud-services/types';
import useChrome from '../useChrome';

const usePendoFeedback = () => {
  const { usePendoFeedback: usePendoFeedbackInternal } = useChrome<ChromeAPI>();
  /**
   * Return no-op in case the chrome changes are not avaiable in current env.
   */
  if (typeof usePendoFeedbackInternal !== 'function') {
    console.warn('The "usePendoFeedback" hook is not available in this enviroment. Default feedback form will be used. Wait for chrome updates.');
    return;
  }
  return usePendoFeedbackInternal();
};

export default usePendoFeedback;
