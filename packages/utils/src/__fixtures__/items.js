export const severityLevels = ['high', 'medium', 'low', 'unknown'];

export default (count) => {
  let currentCount = 0;
  return [...new Array(count > 0 ? count : 1)]
    .map(() => {
      currentCount++;
      return {
        id: currentCount,
        severity: severityLevels[currentCount % 4],
        name: 'TEST ITEM #' + currentCount,
        description: 'DESCRIPTION',
      };
    })
    .sort();
};
