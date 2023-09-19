import React from 'react';
import Battery from '@patternfly/react-component-groups/dist/dynamic/Battery';

/**
 * @deprecated Do not use deprecated NullBattery import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NullBattery: React.FunctionComponent<any> = (props) => <Battery {...props} severity="null" />;

export default NullBattery;
