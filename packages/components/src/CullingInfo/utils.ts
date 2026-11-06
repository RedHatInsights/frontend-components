import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import messages from '../messages';

export type CullingDate = string | number | Date;

export type CullingInfo = {
  isWarn?: boolean;
  isError?: boolean;
  msg: string;
};
export type CalculateTooltip = (
  culled: CullingDate,
  warning: CullingDate,
  currDate: CullingDate,
  intl?: ReturnType<typeof getIntlWithFallback>,
) => CullingInfo;

export const seconds = 1000;
export const minutes: number = seconds * 60;
export const hours: number = minutes * 60;
export const days: number = hours * 24;

export const calculateTooltip: CalculateTooltip = (culled, warning, currDate, intl = getIntlWithFallback()) => {
  const culledDate: Date = new Date(culled);
  const warningDate: Date = new Date(warning);
  const diffTime: number = new Date(currDate).valueOf() - warningDate.valueOf();
  const removeIn: number = Math.ceil((culledDate.valueOf() - new Date(currDate).valueOf()) / days);
  const msg = intl.formatMessage(messages.cullingInfoRemovalScheduled, { count: removeIn });
  if (diffTime >= 0) {
    return {
      isError: true,
      msg,
    };
  }

  return {
    isWarn: true,
    msg,
  };
};
