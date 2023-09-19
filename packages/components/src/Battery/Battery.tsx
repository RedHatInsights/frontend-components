import React from 'react';
import BatteryPF, { BatteryProps } from '@patternfly/react-component-groups/dist/dynamic/Battery';

/**
 * @deprecated Do not use deprecated Battery import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Battery: React.FunctionComponent<BatteryProps> = BatteryPF;

export default Battery;
