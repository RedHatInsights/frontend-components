export type CullingDate = string | number | Date;

export type CullingInfo = {
  isWarn?: boolean;
  isError?: boolean;
  msg: string;
};
export type CalculateTooltip = (culled: CullingDate, warning: CullingDate, currDate: CullingDate) => CullingInfo;

export const seconds = 1000;
export const minutes: number = seconds * 60;
export const hours: number = minutes * 60;
export const days: number = hours * 24;

export const calculateTooltip: CalculateTooltip = (culled, warning, currDate) => {
  const culledDate: Date = new Date(culled);
  const warningDate: Date = new Date(warning);
  const diffTime: number = new Date(currDate).valueOf() - warningDate.valueOf();
  const removeIn: number = Math.ceil((culledDate.valueOf() - new Date(currDate).valueOf()) / days);
  const msg = `System scheduled for inventory removal in ${removeIn} days`;
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
