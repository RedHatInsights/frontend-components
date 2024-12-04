import React from 'react';
import Severity, { SeverityProps } from '@patternfly/react-component-groups/dist/dynamic/Severity';

/**
 * @deprecated Do not use deprecated MediumBattery import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MediumBattery: React.FunctionComponent<SeverityProps> = (props) => <Severity {...props} severity="moderate" />;

export default MediumBattery;
