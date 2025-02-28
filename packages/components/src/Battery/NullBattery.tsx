import React from 'react';
import Severity from '@patternfly/react-component-groups/dist/dynamic/Severity';

/**
 * @deprecated Do not use deprecated NullBattery import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NullBattery: React.FunctionComponent<any> = (props) => <Severity {...props} severity="null" />;

export default NullBattery;
