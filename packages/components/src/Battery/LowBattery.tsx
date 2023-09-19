import React from 'react';
import Battery, { BatteryProps } from '@patternfly/react-component-groups/dist/dynamic/Battery';

/**
 * @deprecated Do not use deprecated LowBattery import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LowBattery: React.FunctionComponent<BatteryProps> = (props) => <Battery {...props} severity="low" />;

export default LowBattery;
